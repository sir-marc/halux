import { HaluxSetStoreActionI } from './haluxDuckInterfaces';
import { SET_STORE } from './halusTypes';

export const haluxReducer = ( state: any = {}, action: HaluxSetStoreActionI) => {
	switch(action.type) {
		case SET_STORE: return action.payload;
		default: return state;
	}
}