import { prompt } from "enquirer";
import { getEnvValue, setAllEnvValues, EnvMap } from "../lib/env";
import { loginLevel1 } from "../spid-env-test";

import { tryCatch, taskEitherSeq } from "fp-ts/lib/TaskEither";
import * as OPT from "fp-ts/lib/Option";
import { toError, fromNullable } from "fp-ts/lib/Either";
import { array } from "fp-ts/lib/Array";

class ParamReadError extends Error {
  constructor() {
    super(
      `Something went wrong while reading params. Probably the program was forced to terminate.`
    );
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

const environmentSetup = async () => {
  const backendHostTask = tryCatch(
    getEnvValue("IO_BACKEND_HOST").fold(
      singlePrompt({ message: "Insert the IO Backend host" }),
      value => () => Promise.resolve(value)
    ),
    toError
  );

  const backendBasepathTask = tryCatch(
    getEnvValue("IO_BACKEND_BASEPATH").fold(
      singlePrompt({ message: "Insert the IO Backend base path" }),
      value => () => Promise.resolve(value)
    ),
    toError
  );

  const spidTestenvHostTask = tryCatch(
    OPT.fromNullable(process.env.SPID_LOGIN_HOST).fold(
      singlePrompt({ message: "Insert spid test host" }),
      value => () => Promise.resolve(value)
    ),
    toError
  );

  const usernameTask = tryCatch(
    OPT.fromNullable(process.env.SPID_USERNAME).fold(
      singlePrompt({ message: "Insert username" }),
      value => () => Promise.resolve(value)
    ),
    toError
  );

  const passwordTask = tryCatch(
    OPT.fromNullable(process.env.SPID_PASSWORD).fold(
      singlePrompt({ message: "Insert password" }),
      value => () => Promise.resolve(value)
    ),
    toError
  );

  const sessionTokenTask = getEnvValue("SPID_SESSION_TOKEN").fold(
    array
      .sequence(taskEitherSeq)([
        spidTestenvHostTask,
        usernameTask,
        passwordTask
      ])
      .chain(([host, username, password]) =>
        loginLevel1({
          username,
          password,
          host
        })
      ),
    value => tryCatch(() => Promise.resolve(value), toError)
  );

  /*   username: "alice.rossi",
  password: "io-app-test",
  host: "https://app-backend.dev.io.italia.it" */

  /*   const SPID_LOGIN_HOST = "https://app-backend.dev.io.italia.it";
  const USERNAME = "alice.rossi";
  const PASSWORD = "io-app-test";
  const sessionTokenTask = loginLevel1({
    username: "alice.rossi",
    password: "io-app-test",
    host: "https://app-backend.dev.io.italia.it"
  }); */

  return array
    .sequence(taskEitherSeq)([
      backendHostTask,
      backendBasepathTask,
      sessionTokenTask
    ])
    .fold(
      reason => {
        console.error(reason);
        throw new ParamReadError();
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
  const env = await environmentSetup();
  setAllEnvValues(env);
};
