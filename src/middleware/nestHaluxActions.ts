import { HaluxActionI, HaluxActionCreatorI, HaluxActionObjectI } from '../interfaces/HaluxActionInterface';
import { haluxActionType } from './constants/haluxActionType';
import { haluxSymbol, createHaluxAction } from './createHaluxAction';

type func = (...args: any[]) => HaluxActionI;

export const nestHaluxActions = (parent: (...args: any[]) => HaluxActionI, child: (...args: any[]) => HaluxActionI) => {
	return (...values: any[]): HaluxActionI => {
		return {
			type: haluxActionType,
			payload: {
				[haluxSymbol]: [
					...parent(...values.slice(0, -1)).payload[haluxSymbol],
					...child(...values.slice(-1)).payload[haluxSymbol]
				]
			}
		};
	};
};
