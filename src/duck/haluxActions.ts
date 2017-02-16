import { HaluxSetStoreActionI } from "./haluxDuckInterfaces";
import { SET_STORE } from "./haluxTypes";

export const setStore = (newStore: any): HaluxSetStoreActionI => ({
	type: SET_STORE,
	payload: newStore,
});