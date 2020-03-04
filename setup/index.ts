import {
  /* askSessionToken, */

  askIOBackendHost,
  askIOBackendBasePath
} from "./prompt";
import {
  get as getEnvValue,
  setAll as setAllEnvValues,
  EnvKey,
} from "../lib/env";

const ask = (key: EnvKey, promptFn: () => Promise<string>) => {
  return getEnvValue(key).fold(promptFn, value => () =>
    Promise.resolve(value)
  )();
};

const testSuiteSetup = async () => {
  const IO_BACKEND_HOST = await ask("IO_BACKEND_HOST", askIOBackendHost);
  const IO_BACKEND_BASEPATH = await ask(
    "IO_BACKEND_BASEPATH",
    askIOBackendBasePath
  );
  setAllEnvValues({
    IO_BACKEND_HOST,
    IO_BACKEND_BASEPATH
  });
};

export default testSuiteSetup;
