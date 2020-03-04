import { ensure as ensureEnvValue } from "../../lib/env";
import fetchApi from '../../lib/fetch';

describe("getApiUserProfile", () => {
  const host = ensureEnvValue("IO_BACKEND_HOST");
  const basePath = ensureEnvValue("IO_BACKEND_BASEPATH");
  const endpoint = `${host}${basePath}/api-profile`;

  it("should return unauthorized in case it's called without sessionToken", async () => {
    const headers = {};
    const expectedHttpCode = 401;
    const expectedBody = "Unauthorized";

    const client = () => fetchApi(endpoint, { headers });
    const response = await client();

    expect(response.status).toBe(expectedHttpCode);

    const body = await response.text();

    expect(body).toEqual(expectedBody);
  });
  
  it("should return unauthorized in case it's called with an invalid sessionToken", async () => {
    const headers = {};
    const expectedHttpCode = 401;
    const expectedBody = "Unauthorized";

    const client = () => fetchApi(endpoint, { headers });
    const response = await client();

    expect(response.status).toBe(expectedHttpCode);

    const body = await response.text();

    expect(body).toEqual(expectedBody);
  });
});
