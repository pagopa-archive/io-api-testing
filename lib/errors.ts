export class ParamReadError extends Error {
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

export class RequiredParamError extends Error {
  constructor(paramName: string) {
    super(`Required param not provided: ${paramName}`);
  }
}
