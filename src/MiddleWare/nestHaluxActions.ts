import { HaluxActionI, HaluxActionCreatorI } from '../interfaces/HaluxActionInterface';
import { haluxActionType } from '../constants/haluxActionType'
import { haluxSymbol, createHaluxAction } from './createHaluxAction';

type func = (...args: any[]) => HaluxActionI

export const nestHaluxActions = (actions: func[]) => {
	return (values: any[]) => {
		actions.forEach((action, index) => {
			if (Array.isArray(values[index])) {
				action(...values[index])
			} else if (values[index]) {
				action(values[index])
			} else {
				action();
			}
		})
	}
}
