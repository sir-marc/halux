import { HaluxActionI } from '../interfaces/HaluxInterface';
import { SchemaWithLocationI } from '../interfaces/SchemaInterface';
import { findSchemaWithLocation } from '../utils/schemaUtils';


interface ActionI extends HaluxActionI {
	type: string,
	payload: any,
}

export const createHalux = (schemasWithLocation: SchemaWithLocationI[]) => {
	return (store: any) => (next: any) => (action: ActionI) => {
		if (action.metadata.halux.go) {
			const { metadata, payload } = action;
			const { halux } = metadata

			const schemaFinder = findSchemaWithLocation(schemasWithLocation)
		
			const { schema, location } = schemaFinder(halux.schema)

		}
		// middleware is not needed
		return next(action)
	}

} 