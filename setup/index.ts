import { /* askSessionToken, */ askIOBackendBaseurl } from "./prompt";
import { get as getEnvValue, set as setEnvValue, EnvKey } from "../lib/env";

const promptIfNot = async (key: EnvKey, fn: Function) => {
  if (!getEnvValue(key)) {
    const value = await fn();
    setEnvValue(key, value);
  }
};

const testSuiteSetup = async () => {
  // await promptIfNot("SPID_SESSION_TOKEN", askSessionToken);
  await promptIfNot("IO_BACKEND_HOST", askIOBackendBaseurl);
};

export default testSuiteSetup;
