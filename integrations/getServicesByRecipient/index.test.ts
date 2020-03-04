import { get as getEnvValue } from "../../lib/env";
import fetchApi from "../../lib/fetch";

describe("getServicesByRecipient", () => {
  const host = getEnvValue("IO_BACKEND_HOST").getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_HOST"`);
  });
  const basePath = getEnvValue("IO_BACKEND_BASEPATH").getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_BASEPATH"`);
  });
  const endpoint = `${host}${basePath}/profile/sender-services`;

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
