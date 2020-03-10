import { prompt } from "enquirer";
import { EnvMap, SuiteParams } from "../lib/types";
import { loginLevel1 } from "../spid-env-test";

import { tryCatch, taskEitherSeq } from "fp-ts/lib/TaskEither";
import { fromNullable } from "fp-ts/lib/Option";
import { toError } from "fp-ts/lib/Either";
import { array } from "fp-ts/lib/Array";

class ParamReadError extends Error {
  constructor(reason: any) {
    if (typeof reason === "string") {
      super(`Something went wrong while reading params. Reason: ${reason}`);
    } else {
      console.error("ParamReadError", reason);
      super(
        `Something went wrong while reading params. Probably the program was forced to terminate.`
      );
    }
  }
}

const singlePrompt = ({ message }: { message: string }) => () =>
  prompt({
    type: "input",
    name: "value",
    message,
    validate(value: string /*, state, item, index*/) {
      if (!value) {
        return "required";
      }
      return true;
    }
  }).then((e: Partial<{ value: string }>) => e.value || "");

const suiteParams: SuiteParams = { ...process.env };

const backendHostTask = tryCatch(
  fromNullable(suiteParams.IO_BACKEND_HOST).fold(
    singlePrompt({ message: "Insert the IO Backend host" }),
    value => () => Promise.resolve(value)
  ),
  toError
);

const backendBasepathTask = tryCatch(
  fromNullable(suiteParams.IO_BACKEND_BASEPATH).fold(
    singlePrompt({ message: "Insert the IO Backend base path" }),
    value => () => Promise.resolve(value)
  ),
  toError
);

const spidTestenvHostTask = tryCatch(
  fromNullable(suiteParams.SPID_LOGIN_HOST).fold(
    singlePrompt({ message: "Insert spid test host" }),
    value => () => Promise.resolve(value)
  ),
  toError
);

const usernameTask = tryCatch(
  fromNullable(suiteParams.SPID_USERNAME).fold(
    singlePrompt({ message: "Insert username" }),
    value => () => Promise.resolve(value)
  ),
  toError
);

const passwordTask = tryCatch(
  fromNullable(suiteParams.SPID_PASSWORD).fold(
    singlePrompt({ message: "Insert password" }),
    value => () => Promise.resolve(value)
  ),
  toError
);

const sessionTokenTask = fromNullable(suiteParams.SPID_SESSION_TOKEN).fold(
  array
    .sequence(taskEitherSeq)([spidTestenvHostTask, usernameTask, passwordTask])
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
      backendHostTask,
      backendBasepathTask,
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
