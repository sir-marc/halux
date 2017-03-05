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
	location: string,
	handlers: any,
	overwriteStore: boolean
): any => {
	const state = Immutable.Map<string, any>(get(store.getState(), location));

	const demandedResource = command.getResource();
	const resource = getResourceFromStore(state, new Resource(demandedResource.getSchema(), demandedResource.getLink(), demandedResource.getData()));
	let promise: Promise<{}>;
	let isFirstToCallForResource = true;
	if(resource === undefined) {
		// first call to root object (empty state)
		if(state.count() === 0) {
			const rootResource = new Resource(demandedResource.getSchema());
			promise = crawl(config, new Command(rootResource, action.GET), state);
			const newState = putInStoreAsPending(promise, rootResource, state);
			store.dispatch(haluxActions.setStore(newState));
		} else {
			// the client might try to ask for links which are not provided by the backend, these must be ignored
			return;
		}
	} else if((resource.isShallow() || overwriteStore) && !resource.isPending()) {
		promise = crawl(config, new Command(resource, command.getAction(), command.getDestinationSchema(), command.getBody()), state);
		const newState = putInStoreAsPending(promise, resource, state);
		store.dispatch(haluxActions.setStore(newState));
	} else if(resource.isPending()) {
		isFirstToCallForResource = false;
		promise = resource.getPromise();
	} else {
		isFirstToCallForResource = false;
		promise = Promise.resolve(state);
	}

	if(handlers && handlers.pendingHandler) {
		handlers.pendingHandler(store);
	}

	promise.then((state:any) => {
		if(handlers && handlers.successHandler) {
			handlers.successHandler(store, state);
		}
		// another call has already posted the changes to the state - therefore we don't have to do it again
		if(isFirstToCallForResource) {
			store.dispatch(haluxActions.setStore(state));
		}
		if(actions.length !== 0) {
			const [ head, ...tail ] = actions;
			const parentSchema = command.getDestinationSchema();
			const schemaInstanceInParent = parentSchema.getChildren().find(child => Array.isArray(child) ? child[0] === head.schema : child === head.schema);
			const isMappedAsList = Array.isArray(schemaInstanceInParent);
			let resourceRequests = [];
			if(isMappedAsList && head.identifiers === undefined) {
				const resource = getResourceFromStore(state, new Resource(parentSchema, demandedResource.getLink(), demandedResource.getData()));
				const childLinks = resource.getChildLink(head.schema);
				if(childLinks !== undefined) {
					resourceRequests = childLinks.map((link: any) => new Resource(head.schema, link, undefined));
				}
			} else if(schemaInstanceInParent === undefined || isMappedAsList) {
				resourceRequests.push(new Resource(head.schema, undefined, head.identifiers));
			} else {
				const resource = getResourceFromStore(state, new Resource(parentSchema, demandedResource.getLink(), demandedResource.getData()));
				resourceRequests.push(new Resource(head.schema, resource.getChildLink(head.schema), head.identifiers));
			}
			resourceRequests.forEach((resourceRequest : any) => {
				// only if either a link or data has been given a load of a resource makes sense - otherwise the resource is not available
				if(resourceRequest.getLink() !== undefined || resourceRequest.getData() !== undefined) {
					scramble(config, new Command(resourceRequest, head.body === undefined ? action.GET : action.POST, head.into, head.body), tail, store, location, head.handlers, head.overwriteStore);
				}
			});
		}
	}).catch((err: any) => {
		if(handlers && handlers.errorHandler) {
			handlers.errorHandler(store, err);
		} else {
			// if no error handler has been configured the error will be propagated
			throw err;
		}
	});
};

export const createHalux = (halCrawlerConfig: HalCrawlerConfigMap, location = 'data.halux') => {
	return (store: any) => (next: any) => (action: HaluxActionI) => {
		if ( action && action.payload && action.payload[haluxSymbol]) {
			const actions = action.payload[haluxSymbol];
			const [ head, ...tail ] = actions;

			scramble(halCrawlerConfig, new Command(new Resource(head.schema)), tail, store, location, head.handlers, head.overwriteStore);

		}
		// middleware is not needed
		return next(action);
	};
};
