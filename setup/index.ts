import { ParamReadError, RequiredParamError } from "../lib/errors";
import { EnvMap, SuiteParams } from "../lib/types";
import { loginLevel1 } from "../spid-env-test";

import { tryCatch, taskEitherSeq, fromEither } from "fp-ts/lib/TaskEither";
import { fromNullable } from "fp-ts/lib/Option";
import {
  toError,
  left,
  right,
  either,
  Either,
  fromNullable as fromNullableE
} from "fp-ts/lib/Either";
import { array } from "fp-ts/lib/Array";

const suiteParams: SuiteParams = { ...process.env };

const backendHostTask = fromNullableE(
  new RequiredParamError("IO_BACKEND_HOST")
)(suiteParams.IO_BACKEND_HOST);

const backendBasepathTask = fromNullableE(
  new RequiredParamError("IO_BACKEND_BASEPATH")
)(suiteParams.IO_BACKEND_BASEPATH);

const spidTestenvHostTask = fromNullableE(
  new RequiredParamError("SPID_LOGIN_HOST")
)(suiteParams.SPID_LOGIN_HOST);

const usernameTask = fromNullableE(
  new RequiredParamError("SPID_USERNAME")
)(suiteParams.SPID_USERNAME);

const passwordTask = fromNullableE(
  new RequiredParamError("SPID_PASSWORD")
)(suiteParams.SPID_PASSWORD);

const sessionTokenTask = fromNullable(suiteParams.SPID_SESSION_TOKEN).fold(
  array
    .sequence(taskEitherSeq)(
      [spidTestenvHostTask, usernameTask, passwordTask].map(fromEither)
    )
    .chain(([host, username, password]) =>
      loginLevel1({
        username,
        password,
        host
      })
    ),
  value => tryCatch(() => Promise.resolve(value), toError)
);

const environmentSetup = async (): Promise<EnvMap> => {
  return array
    .sequence(taskEitherSeq)([
      fromEither(backendHostTask),
      fromEither(backendBasepathTask),
      sessionTokenTask
    ])
    .fold(
      reason => {
        throw new ParamReadError(reason);
      },
      ([IO_BACKEND_HOST, IO_BACKEND_BASEPATH, SPID_SESSION_TOKEN]) => ({
        IO_BACKEND_HOST,
        IO_BACKEND_BASEPATH,
        SPID_SESSION_TOKEN
      })
    )
    .run();
};

export default async () => {
  const suiteConfiguration = await environmentSetup();
  Object.entries(suiteConfiguration).forEach(([key, value]) => {
    process.env[key] = value;
  });
};
