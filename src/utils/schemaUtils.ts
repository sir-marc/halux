import { SchemaWithLocationI } from '../interfaces/SchemaInterface';
import { Schema } from 'hal-crawler';


export const findSchemaWithLocation = (schemasWithLocation: SchemaWithLocationI[]) =>
	(schema: Schema) =>
		schema ? schemasWithLocation.filter(swl => swl.schema.getName() === schema.getName())[0] : undefined;
