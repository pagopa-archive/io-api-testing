import {
  /* askSessionToken, */

  askIOBackendHost,
  askIOBackendBasePath
} from "./prompt";
import { get as getEnvValue, set as setEnvValue, EnvKey } from "../lib/env";
import { Option, none, some } from "fp-ts/lib/Option";

const toPromise = (o: Option<string>) =>
  o.fold(none, value => some(Promise.resolve(value)));

const promptIfNot = (key: EnvKey, promptFn: () => Promise<string>) => {
  const setter = async () => {
    const value = await promptFn();
    setEnvValue(key, value);
    return value;
  };
  return toPromise(getEnvValue(key)).getOrElseL(setter);
};

const testSuiteSetup = async () => {
  await promptIfNot("IO_BACKEND_HOST", askIOBackendHost);
  await promptIfNot("IO_BACKEND_BASEPATH", askIOBackendBasePath);
};

export default testSuiteSetup;
