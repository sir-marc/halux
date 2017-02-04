import { SchemaI } from './SchemaInterface';

export interface HaluxMetadataI {
	go: boolean,
	schema: SchemaI,
	get?: SchemaI[],
}

export interface HaluxActionI {
	metadata: {
		halux: HaluxMetadataI,
	}
}
