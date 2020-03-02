import fetch from "node-fetch";

import { get as getEnvValue } from "../../lib/env";

describe("getUserProfile", () => {
  const backendBaseurl = getEnvValue("IO_BACKEND_HOST");
  const endpoint = `${backendBaseurl}/profile`;

  test("is unauthorized without sessionToken", async () => {
    const headers = {};
    const expectedHttpCode = 401;
    const expectedBody = "Unauthorized";

    const client = () => fetch(endpoint, { headers });
    console.log({ endpoint });
    const response = await client();

    expect(response.status).toBe(expectedHttpCode);

    const body = await response.text();

    expect(body).toEqual(expectedBody);
  });

  test("is unauthorized with invalid sessionToken", async () => {
    const headers = { Authorization: "Bearer: invalid_token" };
    const expectedHttpCode = 401;
    const expectedBody = "Unauthorized";

    const client = () => fetch(endpoint, { headers });
    console.log({ endpoint });
    const response = await client();

    expect(response.status).toBe(expectedHttpCode);

    const body = await response.text();

    expect(body).toEqual(expectedBody);
  });
});
