import {
  /* askSessionToken, */

  askIOBackendHost,
  askIOBackendBasePath
} from "./prompt";
import {
  getEnvValue,
  setAllEnvValues,
  EnvMap
} from "../lib/env";

import { tryCatch, taskEitherSeq } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { array } from "fp-ts/lib/Array";

class ParamReadError extends Error {
  constructor() {
    super(
      `Something went wrong while reading params. Probably the program was forced to terminate.`
    );
  }
}

const testSuiteSetup = async () => {

  const backendHostTask = tryCatch(
    getEnvValue('IO_BACKEND_HOST').fold(askIOBackendHost, value => () => Promise.resolve(value)),
    toError
  );
  const backendBasepathTask = tryCatch(
    getEnvValue('IO_BACKEND_BASEPATH').fold(askIOBackendBasePath, value => () => Promise.resolve(value)),
    toError
  );

  const sequence = array.sequence(taskEitherSeq);

  return sequence([backendHostTask, backendBasepathTask])
    .fold(
      () => {
        throw new ParamReadError();
      },
      value => value
    )
    .map(([IO_BACKEND_HOST, IO_BACKEND_BASEPATH]) => {
      setAllEnvValues({
        IO_BACKEND_HOST,
        IO_BACKEND_BASEPATH
      });
    })
    .run();
};

export default testSuiteSetup;
