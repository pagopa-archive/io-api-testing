import { prompt } from "enquirer";
import { getEnvValue, setAllEnvValues } from "../lib/env";

import { tryCatch, taskEitherSeq } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
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

const testSuiteSetup = async () => {
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

  const sessionTokenTask = tryCatch(
    getEnvValue("SPID_SESSION_TOKEN").fold(
      singlePrompt({ message: "Insert a valid session token" }),
      value => () => Promise.resolve(value)
    ),
    toError
  );

  const sequence = array.sequence(taskEitherSeq);

  return sequence([backendHostTask, backendBasepathTask, sessionTokenTask])
    .fold(
      () => {
        throw new ParamReadError();
      },
      value => value
    )
    .map(([IO_BACKEND_HOST, IO_BACKEND_BASEPATH, SPID_SESSION_TOKEN]) => {
      setAllEnvValues({
        IO_BACKEND_HOST,
        IO_BACKEND_BASEPATH,
        SPID_SESSION_TOKEN
      });
    })
    .run();
};

export default testSuiteSetup;
