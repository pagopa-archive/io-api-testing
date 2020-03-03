import { ensure as ensureEnvValue } from "../../lib/env";
import {
  testInvalidToken,
  testNoToken
} from "../../lib/helpers/testUnauthorized";

describe("getServicesByRecipient", () => {
  const host = ensureEnvValue("IO_BACKEND_HOST");
  const basePath = ensureEnvValue("IO_BACKEND_BASEPATH");
  const endpoint = `${host}${basePath}/profile/sender-services`;

  testNoToken(it, endpoint);
  testInvalidToken(it, endpoint);
});
