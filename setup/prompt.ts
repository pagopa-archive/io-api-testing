const { prompt } = require("enquirer");

export const askSessionToken = async (): Promise<string> => {
  const { sessionToken } = await prompt({
    type: "input",
    name: "sessionToken",
    message: "Insert a valid session token",
    validate(value: string /*, state, item, index*/) {
      if (!value) {
        return "required";
      }
      return true;
    }
  });

  return sessionToken;
};

export const askIOBackendHost = async (): Promise<string> => {
  const { ioBackendHost } = await prompt({
    type: "input",
    name: "ioBackendHost",
    message: "Insert the IO Backend host",
    validate(value: string /*, state, item, index*/) {
      if (!value) {
        return "required";
      }
      return true;
    }
  });

  return ioBackendHost;
};

export const askIOBackendBasePath = async (): Promise<string> => {
  const { ioBackendBasePath } = await prompt({
    type: "input",
    name: "ioBackendBasePath",
    message: "Insert the IO Backend base path",
    validate(value: string /*, state, item, index*/) {
      if (!value) {
        return "required";
      }
      return true;
    }
  });

  return ioBackendBasePath;
};
