import { Option, fromNullable } from "fp-ts/lib/Option";
import * as t from "io-ts";

export const EnvKey = t.keyof({
  SPID_SESSION_TOKEN: t.string,
  IO_BACKEND_HOST: t.string,
  IO_BACKEND_BASEPATH: t.string
});

export type EnvKey = t.TypeOf<typeof EnvKey>;

export const EnvMap = t.record(EnvKey, t.string);
export type EnvMap = Partial<t.TypeOf<typeof EnvMap>>;

const pickEnvKeys = (obj: any) =>
  Object.keys(obj).reduce<EnvMap>(
    (p, k: string) =>
      EnvKey.decode(k).fold(
        () => p,
        (key: EnvKey) => ({ ...p, [key]: obj[key] })
      ),
    {}
  );

const env: EnvMap = { ...pickEnvKeys(process.env) };

export const getEnvValue = (key: EnvKey): Option<string> => fromNullable(env[key]);

export const setEnvValue = (key: EnvKey, value: any): void => (env[key] = value);

export const setAllEnvValues = (env: EnvMap): void =>
  Object.entries(env).forEach(([key, value]) =>
    EnvKey.decode(key).fold(
      () => {},
      k => setEnvValue(k, value)
    )
  );

export const ensureValueOrThrow = (key: EnvKey): string | never => {
  return getEnvValue(key).getOrElseL(() => {
    throw new Error(`required value dor "${key}"`);
  });
};
