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

### Environment variables

Those are all Environment variables needed by the application:

| Variable name                          | Description                                                                       | type   |
|----------------------------------------|-----------------------------------------------------------------------------------|--------|
| IO_BACKEND_HOST                        | App backend API hostname, including protocol and excluding trailing `/`           | string |
| IO_BACKEND_BASEPATH                    | App backend API base path, including protocol and excluding trailing `/`          | string |
| SPID_SESSION_TOKEN                     | A valid session token                                                             | string |
| SPID_LOGIN_HOST                        | Hostname for the SPID test provider                                               | string |
| SPID_USERNAME                          | Username for the SPID test provider                                               | string |
| SPID_PASSWORD                          | Password for the SPID test provider                                               | string |


## License
Please refer to [IO license agreement](https://github.com/pagopa/io-app/blob/master/LICENSE).