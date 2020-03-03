import fetch from "node-fetch";
import { ensure as ensureEnvValue } from "../../lib/env";

import {
  basicResponseDecoder,
} from "italia-ts-commons/lib/requests";
import { ServerInfo } from "../../generated/definitions/backend/ServerInfo";
const decoder = basicResponseDecoder(ServerInfo);

describe("getServerInfo", () => {
  const host = ensureEnvValue("IO_BACKEND_HOST");
  const endpoint = `${host}/info`;

  it("correctly exposes server info", async () => {
    const headers = {};
    const expectedHttpCode = 200;

    const client = () => fetch(endpoint, { headers });

    const response = await client();

    expect(response.status).toBe(expectedHttpCode);
  });
});
