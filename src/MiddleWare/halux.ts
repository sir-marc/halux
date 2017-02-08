import { HaluxActionI } from '../interfaces/HaluxActionInterface';
import { SchemaWithLocationI } from '../interfaces/SchemaInterface';
import { findSchemaWithLocation } from '../utils/schemaUtils';
import { haluxSymbol } from './createHaluxAction';

export const createHalux = (schemasWithLocation: SchemaWithLocationI[]) => {
	return (store: any) => (next: any) => (action: HaluxActionI) => {
		if ( action && action.payload &&action.payload[haluxSymbol]) {
			const halux = action.payload[haluxSymbol]

			const schemaFinder = findSchemaWithLocation(schemasWithLocation)
		
			const { schema, location } = schemaFinder(halux.schema)

		}
		// middleware is not needed
		return next(action)
	}

} 