import { SchemaWithLocationI, SchemaI } from '../interfaces/SchemaInterface';


export const findSchemaWithLocation = (schemasWithLocation: SchemaWithLocationI[]) =>
	(schema: SchemaI) =>
		schema ? schemasWithLocation.filter(swl => swl.schema.name === schema.name)[0] : undefined;

export const forEachReference = (schema: SchemaI, callback: (schema: SchemaI) => any) => {
	schema && schema.references ? (
		Object.keys(schema.references).forEach(key => 
			typeof callback === 'function' ? (
				callback(schema.references[key])
			) : (undefined)
		)
	) : ( undefined )
}