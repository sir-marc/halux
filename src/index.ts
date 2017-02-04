import { SchemaI, SchemaWithLocationI } from './interfaces/SchemaInterface';
import { HaluxActionI } from './interfaces/HaluxInterface';
import { findSchemaWithLocation } from './utils/schemaUtils';

interface ActionI extends HaluxActionI {
	type: string,
	payload: any,
}

const createHalux = (schemasWithLocation: SchemaWithLocationI[]) => {
	

	return (store: any) => (next: any) => (action: ActionI) => {
		if (action.metadata.halux.go) {
			const { metadata, payload } = action;
			const { halux } = metadata
		
			const { schema, location } = findSchemaWithLocation(schemasWithLocation, halux.schema)

			if (schema && schema.references) {

			} else {
				console.warn(`your schema "${halux.schema.name}" could not be found, is undefined or has no references`)
			}
		}
		// middleware is not needed
		return next(action)
	}

} 