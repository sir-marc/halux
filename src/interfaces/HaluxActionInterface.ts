import { Schema } from 'hal-crawler';

export interface HaluxActionObjectI {
	schema: Schema;
	identifiers?: {
		[index: string]: any,
	};
	link?: string;
	body?: any;
	into?: Schema;
	overwriteStore?: boolean;
	handlers?: {
		successHandler?: (store: any, haluxState: any) => any,
		pendingHandler?: (store: any) => any,
		errorHandler?: (store: any, error: any) => any,
	};
	config?: any;
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
