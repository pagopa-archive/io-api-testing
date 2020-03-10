import * as t from "io-ts";

export const EnvMap = t.exact(
  t.partial({
    SPID_SESSION_TOKEN: t.string,
    IO_BACKEND_HOST: t.string,
    IO_BACKEND_BASEPATH: t.string
  })
);
export type EnvMap = t.TypeOf<typeof EnvMap>;

export const SuiteParams = t.exact(
  t.partial({
    SPID_SESSION_TOKEN: t.string,
    IO_BACKEND_HOST: t.string,
    IO_BACKEND_BASEPATH: t.string,
    SPID_LOGIN_HOST: t.string,
    SPID_USERNAME: t.string,
    SPID_PASSWORD: t.string
  })
);
export type SuiteParams = t.TypeOf<typeof SuiteParams>;
