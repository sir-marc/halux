import { HaluxActionI } from '../interfaces/HaluxInterface';
import { SchemaWithLocationI } from '../interfaces/SchemaInterface';
import { findSchemaWithLocation, forEachReference } from '../utils/schemaUtils';


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

			if (schema && schema.references) {
				forEachReference(schema, (refSchema) => {
					const { location: loc } = schemaFinder(refSchema);

				})
			} else {
				console.warn(`your schema "${halux.schema.name}" could not be found, is undefined or has no references`)
			}
		}
		// middleware is not needed
		return next(action)
	}

} 