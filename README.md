# IO API TESTING
A test suite for integration testing over the IO api infrastructure

## Motivation
We need to test the API ecosystem behind [IO-app](https://github.com/pagopa/io-app). Please read the original proposal [here](https://docs.google.com/document/d/1WQ6OoqOGGEwcd-YRwLwJiiR_ES8mhTmSF6oGVyB8H70).

## Requirements
* `nodejs` (please refer to `.node_version` for the specific version to use)
* `yarn`
  
## Usage
```
yarn install
yarn generate
yarn start 
```

You'll be propted with a required input in which you can specify the endpoint of the `io-backend` api to test (basepath must be included). Alternatively, you can specify such value in `IO_BACKEND_HOST` environament variable.

## License
Please refer to [IO license agreement](https://github.com/pagopa/io-app/blob/master/LICENSE).