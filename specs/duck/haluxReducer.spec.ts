import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { haluxReducer, haluxTypes } from 'src/duck';

chai.use(sinonChai);

describe('the halux reducer', () => {
	describe('the setStore action', () => {
		it('should set the payload as the new state', () => {
			const oldState = {
				id: '1322',
			};
			const newState = {
				id: '2312',
			};
			expect(haluxReducer(oldState, { type: haluxTypes.SET_STORE, payload: newState}))
				.to.equal(newState);
		})

		it('should return the oldState if action is not recognized', () => {
			const oldState = {
				id: '1322',
			};
			expect(haluxReducer(oldState, { type: 'unknown' } as any))
				.to.equal(oldState);
			expect(haluxReducer(oldState, { type: 'unknown' } as any))
				.to.eql(oldState);
			expect(haluxReducer(undefined, { type: 'unknown' } as any))
				.to.eql({});
		})
	})
})