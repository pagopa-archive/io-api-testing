import { prompt } from "enquirer";
import { tryCatch } from "fp-ts/lib/TaskEither";

const singlePrompt = ({ message }: { message: string }) =>
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

export const askSessionToken = () =>
  tryCatch<Error, string>(
    () => singlePrompt({ message: "Insert a valid session token" }),
    (r: unknown) => new Error()
  );

export const askIOBackendHost = () =>
  tryCatch<Error, string>(
    () => singlePrompt({ message: "Insert the IO Backend host" }),
    (r: unknown) => new Error()
  );

export const askIOBackendBasePath = () =>
  tryCatch<Error, string>(
    () => singlePrompt({ message: "Insert the IO Backend base path" }),
    (r: unknown) => new Error()
  );
