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
  singlePrompt({ message: "Insert a valid session token" });

export const askIOBackendHost = () =>
  singlePrompt({ message: "Insert the IO Backend host" });

export const askIOBackendBasePath = () =>
  singlePrompt({ message: "Insert the IO Backend base path" });
