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
