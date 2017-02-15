import { HaluxActionObjectI, HaluxActionI, HaluxActionCreatorI } from '../interfaces/HaluxActionInterface';
import { haluxActionType } from '../constants/haluxActionType';

export const haluxSymbol = Symbol('halux');

export const createHaluxAction:HaluxActionCreatorI = (obj) => ({
	type: haluxActionType,
	payload: {
		[haluxSymbol]: [obj],
	}
})
