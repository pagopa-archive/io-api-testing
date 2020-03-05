import fetchApi from "../../lib/fetch";
import { getEnvValue } from "../../lib/env";

import { basicResponseDecoder } from "italia-ts-commons/lib/requests";
import { ServerInfo } from "../../generated/definitions/backend/ServerInfo";

const decoder = basicResponseDecoder(ServerInfo);

describe("getServerInfo", () => {
  const host = getEnvValue("IO_BACKEND_HOST").getOrElseL(() => {
    throw new Error(`required value dor "IO_BACKEND_HOST"`);
  });
  const endpoint = `${host}/info`;

  it("should correctly expose server info", async () => {
    const headers = {};
    const expectedHttpCode = 200;

    const client = (): Promise<Response> => fetchApi(endpoint, { headers });

    const response = await client();

    expect.assertions(2);
    expect(response.status).toBe(expectedHttpCode);

    const decoded = await decoder(response);

    if (decoded) {
      decoded.fold(
        () => {},
        ({ value }) => {
          console.log(value);
          expect(ServerInfo.is(value)).toBe(true);
        }
      );
    }
  });
});
