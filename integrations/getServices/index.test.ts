import { ensure as ensureEnvValue } from "../../lib/env";
import {
  testInvalidToken,
  testNoToken
} from "../../lib/helpers/testUnauthorized";

describe("getServices", () => {
  const host = ensureEnvValue("IO_BACKEND_HOST");
  const basePath = ensureEnvValue("IO_BACKEND_BASEPATH");
  const endpoint = `${host}${basePath}/services`;

  testNoToken(it, endpoint);
  testInvalidToken(it, endpoint);
});
