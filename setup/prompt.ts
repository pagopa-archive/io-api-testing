const { prompt } = require("enquirer");

export const askSessionToken = async () => {
  const { sessionToken } = await prompt({
    type: "input",
    name: "sessionToken",
    message: "Insert a valid session token",
    validate(value: string /*, state, item, index*/) {
      if (!value) {
        return 'required';
      }
      return true;
    }
  });

  return sessionToken;
};

export const askIOBackendBaseurl = async () => {
    const { ioBackendBaseUrl } = await prompt({
      type: "input",
      name: "ioBackendBaseUrl",
      message: "Insert the IO Backend base url",
      validate(value: string /*, state, item, index*/) {
        if (!value) {
          return 'required';
        }
        return true;
      }
    });
  
    return ioBackendBaseUrl;
  };
