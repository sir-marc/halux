import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { haluxTypes, haluxActions } from 'src/duck';

chai.use(sinonChai);

const { setStore } = haluxActions;

describe('the halux actions', () => {
	describe('the setStore action', () => {
		it('should be a function', () => {
			expect(setStore).to.be.a('function');
		})

		it('should return the SET_STORE type', () => {
			expect(setStore({}).type).to.equal(haluxTypes.SET_STORE);
		})

		it('should return the passed object as payload', () => {
			const myObj = {
				id: '1222',
			}
			expect(setStore(myObj).payload).to.equal(myObj);
			expect(setStore(myObj).payload).to.eql(myObj);
		})
	})
})