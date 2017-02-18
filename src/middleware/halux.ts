import * as Immutable from 'immutable';
import * as deepFind from 'deep-find';
import { HaluxActionI, HaluxActionObjectI } from '../interfaces/HaluxActionInterface';
import { haluxSymbol } from './createHaluxAction';
import { crawl, HalCrawlerConfigMap, Resource, Command, getResourceFromStore, action } from 'hal-crawler';
import { haluxActions } from '../duck';

const scramble = (
	config: HalCrawlerConfigMap,
	done: (store: Immutable.Map<string, any>) => void,
	command: Command,
	actions: HaluxActionObjectI[],
	store = Immutable.Map<string, any>(),
): any => {
	if (command && actions && actions[0]) {
		return crawl(config, command, store).then((store: any) => {
			const [ head, ...tail ] = actions;
			const resource = getResourceFromStore(store, new Resource(head.schema, undefined, head.identifiers));
			return scramble(config, done, new Command(resource, action.GET), tail, store);
		});
	} else {
		done(store);
	}
};

export const createHalux = (halCrawlerConfig: HalCrawlerConfigMap, location = 'data.halux') => {
	return (store: any) => (next: any) => (action: HaluxActionI) => {
		if ( action && action.payload && action.payload[haluxSymbol]) {
			const actions = action.payload[haluxSymbol];
			const [ head, ...tail ] = actions;

			const done = (newStore: Immutable.Map<string, any>) => {
				store.dispatch(haluxActions.setStore(newStore));
			};

			scramble(halCrawlerConfig, done, new Command(new Resource(head.schema)), tail, deepFind(store, location));

		}
		// middleware is not needed
		return next(action);
	};
};