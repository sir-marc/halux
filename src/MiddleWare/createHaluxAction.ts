import { HaluxActionObjectI, HaluxActionI } from '../interfaces/HaluxActionInterface';

export const haluxSymbol = Symbol('halux');

export const createHaluxAction = (obj: HaluxActionObjectI): HaluxActionI => ({
	type: 'HALUX/HALUX_ACTION',
	payload: {
		[haluxSymbol]: obj,
	}
})