import { Option, fromNullable } from "fp-ts/lib/Option";
import * as t from "io-ts";

export const EnvKey = t.union([
  t.literal("SPID_SESSION_TOKEN"),
  t.literal("IO_BACKEND_HOST"),
  t.literal("IO_BACKEND_BASEPATH")
]);

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

export const get = (key: EnvKey): Option<string> => fromNullable(env[key]);

export const set = (key: EnvKey, value: any): void => (env[key] = value);

export const setAll = (env: EnvMap): void =>
  Object.entries(env).forEach(([key, value]) =>
    EnvKey.decode(key).fold(
      () => {},
      k => set(k, value)
    )
  );

export const ensureValueOrThrow = (key: EnvKey): string | never => {
  return get(key).getOrElseL(() => {
    throw new Error(`required value dor "${key}"`);
  });
};
