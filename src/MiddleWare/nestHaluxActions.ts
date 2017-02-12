import { HaluxActionI, HaluxActionCreatorI } from '../interfaces/HaluxActionInterface';
import { haluxActionType } from '../constants/haluxActionType'
import { haluxSymbol } from './createHaluxAction';

type func = (value?: any) => HaluxActionCreatorI

export const nestHaluxAction = (actions: func[]) => {
	return (values: any[]) => {
		actions.forEach((action, index) => {
			if (Array.isArray(values[index])) {
				action([...values[index]])
			} else if (values[index]) {
				action(values[index])
			} else {
				action();
			}
		})
	}
}