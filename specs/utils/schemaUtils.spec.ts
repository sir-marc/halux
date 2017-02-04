import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { SchemaWithLocationI, SchemaI } from '../../src/interfaces/SchemaInterface';
import { findSchemaWithLocation, forEachReference } from '../../src/utils/schemaUtils';

const schemas: SchemaI[] = [
	{ name: 'schemaOne'},
	{ name: 'schemaTwo'},
	{ name: 'schemaThree'},
	{
		name: 'schemaWithReferences',
		references: {
			'subSchemaOne': { name: 'subSchemaOne' },
			'subSchemaTwo': { name: 'subSchemaTwo' },
			'subSchemaThree': { name: 'subSchemaThree' },
		}
	}
]

const schemasWithLocation: SchemaWithLocationI[] = [
	{ schema: schemas[0], location: 'path.to.schema'},
	{ schema: schemas[1], location: 'path.to.schema'},
	{ schema: schemas[2], location: 'path.to.schema'},
];

chai.use(sinonChai);

describe('the schema utils', () => {
	describe('the findSchemasWithLocation util', () => {
		it('should take a list of SchemasWithLocation and return a function to search in this list', () => {
			expect(findSchemaWithLocation).to.be.a('function');
			expect(findSchemaWithLocation(schemasWithLocation)).to.be.a('function');
		})

		describe('the returned method', () => {
			
			let finder: (schema: SchemaI) => SchemaWithLocationI;

			beforeEach(() => {
				finder = findSchemaWithLocation(schemasWithLocation);
			})
			
			it('should accept a schema and return the schema with location if one was found', () => {
				expect(finder(schemas[0])).to.eql(schemasWithLocation[0]);
				expect(finder(schemas[1])).to.eql(schemasWithLocation[1]);
				expect(finder(schemas[2])).to.eql(schemasWithLocation[2]);
			})

			it('should return undefined if a schema could not be found', () => {
				expect(finder({ name: 'a schema which does not exist'})).to.eql(undefined);
			})

			it('should return undefined if undefined or something else is passed', () => {
				expect(finder(undefined)).to.eql(undefined);
			})
		})
	})
})