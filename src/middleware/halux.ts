import * as Immutable from 'immutable';
import get = require('lodash.get');
import { HaluxActionI, HaluxActionObjectI } from '../interfaces/HaluxActionInterface';
import { haluxSymbol } from './createHaluxAction';
import { crawl, HalCrawlerConfigMap, Resource, Command, getResourceFromStore, action, putInStoreAsPending } from 'hal-crawler';
import { haluxActions } from '../duck';

const scramble = (
	config: HalCrawlerConfigMap,
	command: Command,
	actions: HaluxActionObjectI[],
	store: any,
	location: string
): any => {
	const state = Immutable.Map<string, any>(get(store.getState(), location));

	const demandedResource = command.getResource();
	const resource = getResourceFromStore(state, new Resource(demandedResource.getSchema(), demandedResource.getLink(), demandedResource.getData()));
	let promise: Promise<{}>;
	let isFirstToCallForResource = true;
	// first call to root object (empty state)
	if(resource === undefined) {
		const rootResource = new Resource(demandedResource.getSchema());
		promise = crawl(config, new Command(rootResource, action.GET), state);
		const newState = putInStoreAsPending(promise, rootResource, state);
		store.dispatch(haluxActions.setStore(newState));
	} else if(resource.isShallow() && !resource.isPending()) {
		promise = crawl(config, new Command(resource, action.GET), state);
		const newState = putInStoreAsPending(promise, resource, state);
		store.dispatch(haluxActions.setStore(newState));
	} else if(resource.isPending()) {
		isFirstToCallForResource = false;
		promise = resource.getPromise();
	} else {
		isFirstToCallForResource = false;
		promise = Promise.resolve(state);
	}

	promise.then((state:any) => {
		// another call has already posted the changes to the state - therefore we don't have to do it again
		if(isFirstToCallForResource) {
			store.dispatch(haluxActions.setStore(state));
		}
		if(actions.length !== 0) {
			const [ head, ...tail ] = actions;
			scramble(config, new Command(new Resource(head.schema, undefined, head.identifiers), action.GET), tail, store, location);
		}
	});
};

export const createHalux = (halCrawlerConfig: HalCrawlerConfigMap, location = 'data.halux') => {
	return (store: any) => (next: any) => (action: HaluxActionI) => {
		if ( action && action.payload && action.payload[haluxSymbol]) {
			const actions = action.payload[haluxSymbol];
			const [ head, ...tail ] = actions;

			scramble(halCrawlerConfig, new Command(new Resource(head.schema)), tail, store, location);

		}
		// middleware is not needed
		return next(action);
	};
};
