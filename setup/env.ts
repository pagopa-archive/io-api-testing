type EnvKey = 'SPID_SESSION_TOKEN';

export const get = (key: EnvKey) => (
    process.env[key]
);

export const set = (key: EnvKey, value: any) => (
    process.env[key] = value
);
