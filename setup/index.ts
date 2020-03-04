import {
  /* askSessionToken, */

  askIOBackendHost,
  askIOBackendBasePath
} from "./prompt";
import {
  get as getEnvValue,
  setAll as setAllEnvValues,
  EnvKey
} from "../lib/env";

import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";

const ask = (key: EnvKey, promptFn: () => Promise<string>) => {
  return tryCatch(
    getEnvValue(key).fold(promptFn, value => () => Promise.resolve(value)),
    toError
  );
};

const requiredParamError = (name: EnvKey) =>
  new Error(
    `Something went wrong while reading param ${name}. Probably the program was forced to terminate.`
  );

const testSuiteSetup = async () => {
  const backendHostTask = ask("IO_BACKEND_HOST", askIOBackendHost);
  const backendBasepathTask = ask("IO_BACKEND_BASEPATH", askIOBackendBasePath);

  setAllEnvValues({
    IO_BACKEND_HOST: await backendHostTask
      .fold(
        () => {
          throw requiredParamError("IO_BACKEND_HOST");
        },
        value => value
      )
      .run(),
    IO_BACKEND_BASEPATH: await backendBasepathTask
      .fold(
        () => {
          throw requiredParamError("IO_BACKEND_BASEPATH");
        },
        value => value
      )
      .run()
  });
};

export default testSuiteSetup;
