import { getEnvValue } from "../../lib/env";
import fetchApi from "../../lib/fetch";

import { basicResponseDecoder } from "italia-ts-commons/lib/requests";
import { ServicePublic } from "../../generated/definitions/backend/ServicePublic";

const decoder = basicResponseDecoder(ServicePublic);

describe("getService", () => {
  const host = getEnvValue("IO_BACKEND_HOST").getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_HOST"`);
  });
  const basePath = getEnvValue("IO_BACKEND_BASEPATH").getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_BASEPATH"`);
  });
  const sessionToken = getEnvValue("SPID_SESSION_TOKEN").getOrElseL(() => {
    throw new Error(`required value dor "SPID_SESSION_TOKEN"`);
  });
  const fakeServiceId = "fake_id";
  const existingServiceId = "io-dev-azure";

  it("should return unauthorized in case it's called without sessionToken", async () => {
    const endpoint = `${host}${basePath}/services/${fakeServiceId}`;
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
    const endpoint = `${host}${basePath}/services/${fakeServiceId}`;
    const headers = {};
    const expectedHttpCode = 401;
    const expectedBody = "Unauthorized";

    const client = () => fetchApi(endpoint, { headers });
    const response = await client();

    expect(response.status).toBe(expectedHttpCode);

    const body = await response.text();

    expect(body).toEqual(expectedBody);
  });

  it("should return not found in case it's called with an invalid service id", async () => {
    const endpoint = `${host}${basePath}/services/${fakeServiceId}`;
    const headers = { Authorization: `Bearer ${sessionToken}` };
    const expectedHttpCode = 404;

    const client = () => fetchApi(endpoint, { headers });
    const response = await client();

    expect(response.status).toBe(expectedHttpCode);
  });

  it("should correctly retrieve an existing service", async () => {
    const endpoint = `${host}${basePath}/services/${existingServiceId}`;
    const headers = { Authorization: `Bearer ${sessionToken}` };
    const expectedHttpCode = 200;

    const client = () => fetchApi(endpoint, { headers });
    const response = await client();
    const decoded = await decoder(response);

    expect.assertions(2);
    expect(response.status).toBe(expectedHttpCode);

    if (decoded) {
      decoded.fold(
        () => {},
        ({ value }) => {
          expect(ServicePublic.is(value)).toBe(true);
        }
      );
    }
  });
});
