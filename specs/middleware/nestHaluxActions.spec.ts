import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { nestHaluxActions } from 'src/middleware/nestHaluxActions';

chai.use(sinonChai);

describe('the nestActions helper', () => {
	it('should return a function', () => {
		const first = sinon.spy();
		const second = sinon.spy();
		expect(nestHaluxActions([first, second])).to.be.a('function');
	})

	describe('the returned function', () => {
		it('should call the before passed function with the correct arguments', () => {
			const first = sinon.spy();
			const second = sinon.spy();
			const third = sinon.spy()
			const nested = nestHaluxActions([first, second, third]);
			const firstArgument = 15;
			const secondArgument = [0, 'hi', [2]];
			nested([firstArgument, secondArgument]);
			expect(first.calledWith(firstArgument)).to.be.true;
			expect(second.calledWith(
				secondArgument[0],
				secondArgument[1],
				secondArgument[2]
			)).to.be.true;
			expect(third.args[0].length).to.equal(0);
		})
	})
})