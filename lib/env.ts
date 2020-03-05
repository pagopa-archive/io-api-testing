import { Option, fromNullable } from "fp-ts/lib/Option";
import * as t from "io-ts";

export const EnvMap = t.exact(
  t.partial({
    SPID_SESSION_TOKEN: t.string,
    IO_BACKEND_HOST: t.string,
    IO_BACKEND_BASEPATH: t.string
  })
);
export type EnvMap = t.TypeOf<typeof EnvMap>;

const pickEnvKeys = (obj: any) =>
  Object.entries(obj).reduce(
    (p, [k, v]) =>
      EnvMap.decode({ [k]: v }).fold(
        () => p,
        (o: EnvMap) => ({ ...p, ...o })
      ),
    {}
  );

const env: EnvMap = { ...pickEnvKeys(process.env) };

export const getEnvValue = (key: keyof EnvMap): Option<string> =>
  fromNullable(env[key]);

export const setEnvValue = (key: keyof EnvMap, value: any): void =>
  (env[key] = value);

export const setAllEnvValues = (env: EnvMap): void =>
  Object.entries(env).forEach(([key, value]) =>
    EnvMap.decode({ [key]: value }).fold(
      () => {},
      _ => setEnvValue(key as keyof EnvMap, value)
    )
  );

export const ensureValueOrThrow = (key: keyof EnvMap): string | never => {
  return getEnvValue(key).getOrElseL(() => {
    throw new Error(`required value dor "${key}"`);
  });
};
