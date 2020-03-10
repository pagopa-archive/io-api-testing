import { EnvMap } from "../../lib/types";
import { fromNullable } from "fp-ts/lib/Option";
import fetchApi from "../../lib/fetch";

import { basicResponseDecoder } from "italia-ts-commons/lib/requests";
import { Profile } from "../../generated/definitions/backend/Profile";

const decoder = basicResponseDecoder(Profile);

const globalEnv: EnvMap = process.env;

describe("getUserProfile", () => {
  const host = fromNullable(globalEnv.IO_BACKEND_HOST).getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_HOST"`);
  });
  const basePath = fromNullable(globalEnv.IO_BACKEND_BASEPATH).getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_BASEPATH"`);
  });
  const sessionToken = fromNullable(globalEnv.SPID_SESSION_TOKEN).getOrElseL(() => {
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

    if (decoded) {
      decoded.fold(
        () => {},
        ({ value }) => {
          expect(Profile.is(value)).toBe(true);
        }
      );
    }
  });
});
