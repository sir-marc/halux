import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { nestHaluxActions } from '../../src/middleware/nestHaluxActions';
import { createHaluxAction, haluxSymbol } from '../../src/middleware/createHaluxAction';
import { haluxActionType } from '../../src/constants/haluxActionType'
import { createHalux } from '../../src/middleware/halux';
import { createConfig } from 'hal-crawler';

chai.use(sinonChai);

describe('the halux middleware', () => {
	it('should return a function', () => {
		expect(createHalux(createConfig({ root: 'root.json' }))).to.be.a('function')
	})

	describe('the middleware', () => {
		it('it should return the payload with all actionObjects', () => {
			const fetchRoot = () => createHaluxAction({
				schema: 'root' as any,
				identifiers: undefined
			});

			const fetchClients = ({ clientId: id} : {clientId: number}) => createHaluxAction({
				schema: 'client' as any,
				identifiers: [id]
			});


			const nested = (client: {id: number}) => nestHaluxActions(fetchRoot, fetchClients)({}, client);

			const fetchAnimatls = ({animalId: id} : {animalId: number}) => createHaluxAction({
				schema: 'animal' as any,
				identifiers: [id]
			});

			const deepNest = ({clientId} : {clientId: number}, {animalId} : {animalId: number}) =>
				nestHaluxActions(nested, fetchAnimatls)({clientId}, {animalId})
			const result = deepNest({clientId: 1}, {animalId: 2})
			const halux = result.payload[haluxSymbol];
			
			expect(result.type).to.equal(haluxActionType);
			expect(halux).to.have.length(3);
			expect(halux[0]).to.eql(fetchRoot().payload[haluxSymbol][0])
			expect(halux[1]).to.eql(fetchClients({clientId: 1}).payload[haluxSymbol][0])
			expect(halux[2]).to.eql(fetchAnimatls({animalId: 2}).payload[haluxSymbol][0])
		})
	})
})