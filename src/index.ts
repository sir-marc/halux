interface SchemaI {
	name: string,
	references?: {
		[x:string]: SchemaI,
	}
}

interface HaluxMetadataI {
	go: boolean,
	schema: SchemaI,
	get?: SchemaI[],
}

interface HaluxActionI {
	metadata: {
		halux: HaluxMetadataI,
	}
}

interface ActionI extends HaluxActionI {
	type: string,
	payload: any,
}

interface SchemaWithLocation {
	schema: SchemaI,
	location: string,
}

const createHalux = (schemasWithLocation: SchemaWithLocation[]) => {
	const findSchemaWithLocation = (schema: SchemaI) => 
		schemasWithLocation.filter(swl => swl.schema.name === schema.name)[0];

	const forEachReference = (schema: SchemaI, callback: (schema: SchemaI) => any) => {
		Object.keys(schema.references).forEach(key => callback(schema.references[key]))
	}

	return (store: any) => (next: any) => (action: ActionI) => {
		if (action.metadata.halux.go) {
			const { metadata, payload } = action;
			const { halux } = metadata
		
			const { schema, location } = findSchemaWithLocation(halux.schema)

			if (schema && schema.references) {

			} else {
				console.warn(`your schema "${halux.schema.name}" could not be found, is undefined or has no references`)
			}
		}
		// middleware is not needed
		return next(action)
	}

} 