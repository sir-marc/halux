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

const fetchClients = () => createHaluxAction({
	schema: ClientSchema,
	identifiers: {
		client: 'clientId'
	},
	handlers: {
		errorHandler: fetchClientsFailure(),
	}
})
```


   [HalCrawler]: https://github.com/StuckiSimon/HalCrawler
