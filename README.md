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

You'll be propted with a required input in which you can specify reference for the environment to test. Every input item is overridable by passing its specific env variable:

##### api
*  backend api host (`IO_BACKEND_HOST`) - hostname, including protocol and excluding trailing `/` 
*  backend api base path (`IO_BACKEND_BASEPATH`) - basepath, including leading `/` and excluding trailing `/` 

##### session token
* a valid session token (`SPID_SESSION_TOKEN`)

*or*

* SPID test env (`SPID_LOGIN_HOST`) - hostname, including protocol and excluding trailing `/` 
* username (`SPID_USERNAME`)
* password (`SPID_PASSWORD`)

## License
Please refer to [IO license agreement](https://github.com/pagopa/io-app/blob/master/LICENSE).