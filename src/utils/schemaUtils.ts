export const findSchemaWithLocation = (schemasWithLocation, schema: SchemaI) => 
		schemasWithLocation.filter(swl => swl.schema.name === schema.name)[0];

export const forEachReference = (schema: SchemaI, callback: (schema: SchemaI) => any) => {
		Object.keys(schema.references).forEach(key => callback(schema.references[key]))
	}