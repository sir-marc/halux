import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { nestHaluxActions } from '../../src/middleware/nestHaluxActions';
import { createHaluxAction, haluxSymbol } from '../../src/middleware/createHaluxAction';
import { haluxActionType } from '../../src/middleware/constants/haluxActionType';
import { createHalux } from '../../src/middleware/halux';
import { createConfig, Schema, action } from 'hal-crawler';

chai.use(sinonChai);

describe('the halux middleware', () => {
	it('should return a function', () => {
		expect(createHalux(createConfig({ root: 'root.json' }))).to.be.a('function');
	});

	describe('the middleware', () => {
		it('it should return the payload with all actionObjects', () => {
			const admins = new Schema('ea:admin', ['id'], [action.GET]);
			const orders = new Schema('ea:order', ['id'], [action.GET]);

			// [] => list of resources, if only one can occur the [] can be removed
			const root = new Schema('root', [], [action.GET], [[admins], [orders]]);

			const config = createConfig({
				root: 'http://localhost/root.json'
			});

			const fetchRoot = () => createHaluxAction({
				schema: root,
				identifiers: undefined
			});

			const fetchAdmins = ({ clientId: id}: {clientId: number}) => createHaluxAction({
				schema: 'client' as any,
				identifiers: {
					id,
				}
			});


			const nestedAdmins = (client: {id: number}) => nestHaluxActions(fetchRoot, fetchAdmins)({}, client);

			const adminsAction = nestedAdmins({id: 2});

			createHalux(config)(undefined)(() => {})(adminsAction);

			// const deepNest = ({clientId} : {clientId: number}, {animalId} : {animalId: number}) =>
			// 	nestHaluxActions(nested, fetchAnimatls)({clientId}, {animalId})
			// const result = deepNest({clientId: 1}, {animalId: 2})
			// const halux = result.payload[haluxSymbol];

			// expect(result.type).to.equal(haluxActionType);
			// expect(halux).to.have.length(3);
			// expect(halux[0]).to.eql(fetchRoot().payload[haluxSymbol][0])
			// expect(halux[1]).to.eql(fetchClients({clientId: 1}).payload[haluxSymbol][0])
			// expect(halux[2]).to.eql(fetchAnimatls({animalId: 2}).payload[haluxSymbol][0])
		});
	});
});