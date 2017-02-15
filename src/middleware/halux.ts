import { HaluxActionI, HaluxActionObjectI } from '../interfaces/HaluxActionInterface';
import { SchemaWithLocationI } from '../interfaces/SchemaInterface';
import { findSchemaWithLocation } from '../utils/schemaUtils';
import { haluxSymbol } from './createHaluxAction';
import { crawl, HalCrawlerConfigMap, Resource, Command, getResourceFromStore, action } from 'hal-crawler';
import * as Immutable from 'immutable';

const scramble = (
	config: HalCrawlerConfigMap,
	command: Command,
	actions: HaluxActionObjectI[],
	store = Immutable.Map<string, any>()
) => {
	if (command && actions && actions[0]) {
		crawl(config, command, store).then(store => {
			const [ head, ...tail ] = actions
			const resources = store.get(head.schema.getName())
			const resource = resources.toList(0).get(0);
			scramble(config, new Command(resource, action.GET), tail, store);
		})
	} else {
		return;
	}
}

export const createHalux = (halCrawlerConfig: HalCrawlerConfigMap) => {
	return (store: any) => (next: any) => (action: HaluxActionI) => {
		if ( action && action.payload && action.payload[haluxSymbol]) {
			const haluxActions = action.payload[haluxSymbol]
			const [ head, ...tail ] = haluxActions;
			scramble(halCrawlerConfig, new Command(new Resource(head.schema)), tail, store.halux)
		}
		// middleware is not needed
		return next(action)
	}
}