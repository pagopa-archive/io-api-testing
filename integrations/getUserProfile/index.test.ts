import { getEnvValue } from "../../lib/env";
import fetchApi from "../../lib/fetch";

import {
  basicResponseDecoder,
} from "italia-ts-commons/lib/requests";
import { Profile } from "../../generated/definitions/backend/Profile";

const decoder = basicResponseDecoder(Profile);

describe("getUserProfile", () => {
  const host = getEnvValue("IO_BACKEND_HOST").getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_HOST"`);
  });
  const basePath = getEnvValue("IO_BACKEND_BASEPATH").getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_BASEPATH"`);
  });
  const sessionToken = getEnvValue("SPID_SESSION_TOKEN").getOrElseL(() => {
    throw new Error(`required value dor "SPID_SESSION_TOKEN"`);
  });
  const endpoint = `${host}${basePath}/profile`;

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

  it("should correctly expose user info", async () => {
    const headers = { Authorization: `Bearer ${sessionToken}` };
    const expectedHttpCode = 200;

    const client = (): Promise<Response> => fetchApi(endpoint, { headers });

    const response = await client();
    const decoded = await decoder(response);

    expect(response.status).toBe(expectedHttpCode);

    if (!decoded)
      throw new Error(`Expected response to be in the correct format`);

    decoded.fold(
      _ => {
        throw new Error(`Expected response to be in the correct format`);
      },
      ({ value }) => {
        expect(Profile.is(value)).toBe(true);
      }
    );
  });
});
