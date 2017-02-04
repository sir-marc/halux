export interface SchemaI {
	name: string,
	references?: {
		[x:string]: SchemaI,
	}
}

export interface SchemaWithLocationI {
	location: string,
	schema: SchemaI,
}