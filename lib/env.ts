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

const pick = (obj: any) =>
  Object.keys(obj).reduce<EnvMap>(
    (p, k: string) =>
      EnvKey.decode(k).fold(
        () => p,
        (key: EnvKey) => ({ ...p, [key]: obj[key] })
      ),
    {}
  );

class Env {
  private env: EnvMap;
  private constructor(args: EnvMap) {
    const penv = pick(process.env);
    this.env = { ...penv, ...args };
  }

  static instance() {
    return new Env({});
  }

  get(key: EnvKey): Option<string> {
    return fromNullable(this.env[key]);
  }

  set(key: EnvKey, value: any): void {
    this.env[key] = value;
  }

  ensure(key: EnvKey): string | never {
    return this.get(key).getOrElseL(() => {
      throw new Error(`required value dor "${key}"`);
    });
  }
}

export const get = (key: EnvKey): Option<string> => Env.instance().get(key);

export const set = (key: EnvKey, value: any): void =>
  Env.instance().set(key, value);

export const setAll = (env: EnvMap): void =>
  Object.entries(env).forEach(([key, value]) =>
    EnvKey.decode(key).fold(
      () => {},
      k => set(k, value)
    )
  );

export const ensure = (key: EnvKey): string | never =>
  Env.instance().ensure(key);
