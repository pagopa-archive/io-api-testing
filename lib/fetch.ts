import nodeFetch from "node-fetch";
const fetchApi: typeof fetch = (nodeFetch as any) as typeof fetch;
export default fetchApi;