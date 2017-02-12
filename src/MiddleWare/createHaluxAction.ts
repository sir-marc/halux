import { HaluxActionObjectI, HaluxActionI, HaluxActionCreatorI } from '../interfaces/HaluxActionInterface';

export const haluxSymbol = Symbol('halux');

export const createHaluxAction:HaluxActionCreatorI = (obj) => ({
	type: 'HALUX/HALUX_ACTION',
	payload: {
		[haluxSymbol]: obj,
	}
})
