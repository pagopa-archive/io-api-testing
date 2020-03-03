import {
  /* askSessionToken, */

  askIOBackendHost,
  askIOBackendBasePath
} from "./prompt";
import { get as getEnvValue, set as setEnvValue, EnvKey } from "../lib/env";
import { pipe } from "fp-ts/lib/pipeable";
import { getOrElse, Option, isNone, none, some } from "fp-ts/lib/Option";

const toPromise = (o: Option<string>) =>
  isNone(o) ? none : some(Promise.resolve(o.value));

const promptIfNot = (key: EnvKey, promptFn: () => Promise<string>) => {
  const setter = async () => {
    const value = await promptFn();
    setEnvValue(key, value);
    return value;
  };
  /*  return pipe(
    getEnvValue,
    toPromise,
    getOrElse(setter),
  )(key) */
  return getOrElse(setter)(toPromise(getEnvValue(key)));
};

const testSuiteSetup = async () => {
  await promptIfNot("IO_BACKEND_HOST", askIOBackendHost);
  await promptIfNot("IO_BACKEND_BASEPATH", askIOBackendBasePath);
};

export default testSuiteSetup;
