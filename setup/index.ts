import {
  askSessionToken,
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

const ask = (key: keyof EnvMap, promptFn: () => Promise<string>) => {
  return tryCatch(
    getEnvValue(key).fold(promptFn, value => () => Promise.resolve(value)),
    toError
  );
};

class ParamReadError extends Error {
  constructor() {
    super(
      `Something went wrong while reading params. Probably the program was forced to terminate.`
    );
  }
}

const testSuiteSetup = async () => {
  const sessionTokenTask = ask("SPID_SESSION_TOKEN", askSessionToken);
  const backendHostTask = ask("IO_BACKEND_HOST", askIOBackendHost);
  const backendBasepathTask = ask("IO_BACKEND_BASEPATH", askIOBackendBasePath);

  const sequence = array.sequence(taskEitherSeq);

  return sequence([backendHostTask, backendBasepathTask, sessionTokenTask])
    .fold(
      () => {
        throw new ParamReadError();
      },
      value => value
    )
    .map(([IO_BACKEND_HOST, IO_BACKEND_BASEPATH, SPID_SESSION_TOKEN]) => {
      setAllEnvValues({
        IO_BACKEND_HOST,
        IO_BACKEND_BASEPATH,
        SPID_SESSION_TOKEN
      });
    })
    .run();
};

export default testSuiteSetup;
