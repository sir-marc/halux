import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { SchemaWithLocationI } from '../../src/interfaces/SchemaInterface';
import { findSchemaWithLocation } from '../../src/utils/schemaUtils';
import * as Immutable from 'immutable';
import { Schema } from 'hal-crawler';

const schemas: Schema[] = [
	new Schema('schemaOne', ['id'], 'GET'),
	new Schema('schemaOne', ['id'], 'GET'),
	new Schema('schemaOne', ['id'], 'GET'),
	new Schema('schemaWithReferences', ['id'], 'GET', [
		new Schema('subSchemaOne', ['id'], 'GET'),
		new Schema('subSchemaTwo', ['id'], 'GET'),
		new Schema('subSchemaThree', ['id'], 'GET'),
	]),
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
			
			let finder: (schema: Schema) => SchemaWithLocationI;

			beforeEach(() => {
				finder = findSchemaWithLocation(schemasWithLocation);
			})
			
			it('should accept a schema and return the schema with location if one was found', () => {
				expect(finder(schemas[0])).to.eql(schemasWithLocation[0]);
				expect(finder(schemas[1])).to.eql(schemasWithLocation[1]);
				expect(finder(schemas[2])).to.eql(schemasWithLocation[2]);
			})

			it('should return undefined if a schema could not be found', () => {
				expect(finder(new Schema('a schema which does not exist', ['id'], 'GET'))).to.eql(undefined);
			})

			it('should return undefined if undefined or something else is passed', () => {
				expect(finder(undefined)).to.eql(undefined);
			})
		})
	})
})