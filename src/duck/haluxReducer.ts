import * as Immutable from 'immutable';
import { HaluxSetStoreActionI } from "./haluxDuckInterfaces";
import { SET_STORE } from "./haluxTypes";

// TODO: merge with convertToStore from hal-crawler
const mergeState = (previous: any, newState: any) => {
	let stateToReturn = previous;
	newState.entrySeq().forEach((entry: any) => {
		const key = entry[0];
		const schemaEntrySet = entry[1];
		const previousEntrySet = previous.get(key);
		if(previousEntrySet === undefined) {
			stateToReturn = stateToReturn.set(key, schemaEntrySet);
		} else {
			if(Immutable.Iterable.isIterable(previousEntrySet)) {
				schemaEntrySet.forEach((resource :any) => {
					const previousResource = previousEntrySet.find((previousResource :any) => resource.isModellingSameResourceAs(previousResource));
					if(previousResource === undefined) {
						stateToReturn = stateToReturn.updateIn([key], (schemas: any) => {
	            return schemas.add(resource);
	          });
					} else {
						if(resource.isNewerAs(previousResource)) {
							stateToReturn = stateToReturn.updateIn([key], (schemas: any) => {
								schemas.delete(previousResource);
		            return schemas.add(resource);
		          });
						}
					}
				});
			} else {
				// must be a singular resource instance
				if(schemaEntrySet.isNewerAs(previousEntrySet)) {
					stateToReturn = stateToReturn.set(key, schemaEntrySet);
				}
			}
		}
	});
	return stateToReturn;
}

export const haluxReducer = ( state: any = Immutable.Map<string, any>({}), action: HaluxSetStoreActionI) => {
	switch (action.type) {
		case SET_STORE:
			return mergeState(state, action.payload);
		default: return state;
	}
};
