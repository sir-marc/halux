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

