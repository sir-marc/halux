import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { createHaluxAction, haluxSymbol } from '../../src/middleware/createHaluxAction';
import { haluxActionType } from '../../src/middleware/constants/haluxActionType';
import { HaluxActionObjectI } from '../../src/interfaces/HaluxActionInterface';

chai.use(sinonChai);

describe('the createHaluxAction helper', () => {
	it('should return an action with HALUX_ACTION type', () => {
		expect(createHaluxAction(undefined).type).to.equal(haluxActionType);
	});

	it('should return the passed object inside the payload under the haluxSymbol', () => {
		const myObj: HaluxActionObjectI = {
			schema: undefined,
			identifiers: undefined,
		};
		expect(createHaluxAction(myObj).payload[haluxSymbol][0]).to.equal(myObj);
		expect(createHaluxAction(myObj).payload[haluxSymbol][0]).to.eql(myObj);
	});
});