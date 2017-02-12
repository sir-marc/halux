import { HaluxActionI } from '../interfaces/HaluxActionInterface';
import { SchemaWithLocationI } from '../interfaces/SchemaInterface';
import { findSchemaWithLocation } from '../utils/schemaUtils';
import { haluxSymbol } from './createHaluxAction';
import { crawl, HalCrawlerConfigMap, Resource } from 'hal-crawler';
import * as Immutable from 'immutable';

export const createHalux = (halCrawlerConfig: HalCrawlerConfigMap ,schemasWithLocation: SchemaWithLocationI[]) => {
	return (store: any) => (next: any) => (action: HaluxActionI) => {
		if ( action && action.payload &&action.payload[haluxSymbol]) {
			const halux = action.payload[haluxSymbol]

			crawl(halCrawlerConfig, undefined, Immutable.Map<string, {}>(store))

			const schemaFinder = findSchemaWithLocation(schemasWithLocation)
		
			const { schema, location } = schemaFinder(halux.schema)

		}
		// middleware is not needed
		return next(action)
	}

} 