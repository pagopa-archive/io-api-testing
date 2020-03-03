import fetch from 'node-fetch';

export const testNoToken = (
  it: Function,
  endpoint: string,
  title = "should return unauthorized in case it's called without sessionToken",
) =>
  it(title, async () => {
    const headers = {};
    const expectedHttpCode = 401;
    const expectedBody = "Unauthorized";

    const client = () => fetch(endpoint, { headers });
    const response = await client();

    expect(response.status).toBe(expectedHttpCode);

    const body = await response.text();

    expect(body).toEqual(expectedBody);
  });

export const testInvalidToken = (
  it: Function,
  endpoint: string,
  title = "should return unauthorized in case it's called with an invalid sessionToken"
) =>
  it(title, async () => {
    const headers = {};
    const expectedHttpCode = 401;
    const expectedBody = "Unauthorized";

    const client = () => fetch(endpoint, { headers });
    const response = await client();

    expect(response.status).toBe(expectedHttpCode);

    const body = await response.text();

    expect(body).toEqual(expectedBody);
  });
