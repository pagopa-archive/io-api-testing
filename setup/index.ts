import {
  /* askSessionToken, */

  askIOBackendHost,
  askIOBackendBasePath
} from "./prompt";
import { get as getEnvValue, set as setEnvValue, EnvKey } from "../lib/env";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { task } from "fp-ts/lib/Task";

const promptIfNot = (
  key: EnvKey,
  promptFn: () => TaskEither<Error, string>
) => {
  const setter = () =>
    promptFn().fold<string>(
      error => { throw error },
      value => {
        setEnvValue(key, value);
        return value;
      }
    );
  return getEnvValue(key).fold(setter(), task.of);
};

const testSuiteSetup = async () => {
  await promptIfNot("IO_BACKEND_HOST", askIOBackendHost).run();
  await promptIfNot("IO_BACKEND_BASEPATH", askIOBackendBasePath).run();
};

export default testSuiteSetup;
