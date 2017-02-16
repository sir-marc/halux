# Work in porgress
Don't try to use this middleware right now. Work is still in progress.
If you're interested don't hesitate to talk with us and tell us your usecase

# halux
HAL middleware for Redux which uses [HalCrawler] under the hood.
If you're state matches the HAL conventions described in the above Repo, you can use this middleware to to load nested HAL ressources easily.
The authors of both modules teamed up and discussed the API and application flow together.

## Usage
To use this module, please install it's peer dependency [HalCrawler].
```
$ npm install -S halCrawler
```
Setup your HAL config and then install this module using:

```
$ npm install -S halux
```

For the following examples i use the config used by Hal-Crawler.

### create a Halux action
We provide a helper method for you to create a Halux action.
Allthough it's not necessary, we highly recommend using it.

```
The interface for this action is:
(haluxObject: {
	schema: Schema, // a Hal-crawler Schema
	identifiers: {
		[index: string]: any, // an object of identifiers to identify the different Ressources
	},
	handlers?: { // handler to be called on a particular event. Can be a redux-action or a regular function
		successHandler?: (obj: any) => any,
		pendingHandler?: () => any,
		errorHandler?: (error: any) => any,
	}
}): HaluxActionI
```

You can use the method something like this:

```
import { createHaluxAction } from 'halux';

const fetchRoot = () => createHaluxAction({
	schema: root,
	identifiers: undefined
});

const fetchAdmins = ({ clientId: id} ) => createHaluxAction({
	schema: admins,
	identifiers: {
		id,
	},
	handlers: {
		errorHandler: (error) => console.log(error.toString())
	}
});
```

###nestHaluxActions
Because each Schema must be inside the rootschema, nesting actions is need.
You can use the provided `nestHaluxActions` method to do so.
It is possible to nest data as many layers deep as you need to, but only one level per method called

The interface is:
 ```
const nested = nestHaluxActions(
	() => createHaluxAction({...}), 
	() => createHaluxAction({...})
);

nested({}, {}); // one object per method
 ```

Example using the above setup:
```
const nestedAdmins = (client) => nestHaluxActions(fetchRoot, fetchAdmins)({}, client);

// now you would dispatch this action like this:
dispatch(nestedAdmins({ clientId: 1 }))
```


###Reducer
This library provides it's own reducer which you should insert into your state.
The reducer knows how to handle the actions created by the middleware and updates the store accordingly.
It is not recommended to a custom reducer for managing those actions as it's considered as an internal feature and may change.
To use the reducer import `haluxReducer` from the middleware and combine it into your store.

Example:

```
import { combineReducers } from 'redux';
import { haluxReducer } from 'halux';

export const store = combineReducers({
	app: {}, // your app state
	data: combineReducers({
		halux: haluxReducer,
		somethingOther: {},
	})
})
```

###Middleware
Finally you have to add the middleware.
There is a helper method to create the middleware which you must use.
It accepts the hal-crawler config as the first parameter and the location of the halux store inside the store as a second parameter.
The location must be a string and may be something like this: `'data.halux'`.
The helper function returns the middleware which can be passed to the createStore method.

```
import { createHalux } from 'halux';
import { createStore, applyMiddleware } from 'redux';

const haluxMiddleware = createHalux(config, 'data.halux');

const store = createStore(
  reducers,
  undefined,
  applyMiddleware(haluxMiddleware)
)

```

   [HalCrawler]: https://github.com/StuckiSimon/HalCrawler
