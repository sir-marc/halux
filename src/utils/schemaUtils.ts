import { SchemaWithLocationI, SchemaI } from '../interfaces/SchemaInterface';


export const findSchemaWithLocation = (schemasWithLocation: SchemaWithLocationI[]) =>
	(schema: SchemaI) =>
		schema ? schemasWithLocation.filter(swl => swl.schema.name === schema.name)[0] : undefined;
