import { Schema } from 'hal-crawler';

export interface HaluxActionObjectI {
	schema: Schema;
	identifiers: {
		[index: string]: any,
	};
	handlers?: {
		successHandler?: (obj: any) => any,
		pendingHandler?: () => any,
		errorHandler?: (error: any) => any,
	};
}

export interface HaluxActionI {
	type: string;
	payload: {
		[index: string]: HaluxActionObjectI[]
	};
}

export interface HaluxActionCreatorI {
	(obj: HaluxActionObjectI): HaluxActionI;
}