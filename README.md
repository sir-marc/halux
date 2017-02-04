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


   [HalCrawler]: https://github.com/StuckiSimon/HalCrawler
