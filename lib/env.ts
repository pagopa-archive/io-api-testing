import { Option, fromNullable, isNone } from 'fp-ts/lib/Option';

export type EnvKey = (
    'SPID_SESSION_TOKEN'
    | 'IO_BACKEND_HOST'
    | 'IO_BACKEND_BASEPATH'
);

export const get = (key: EnvKey): Option<string> => (
    fromNullable(process.env[key])
);

export const set = (key: EnvKey, value: any): void => (
    process.env[key] = value
);

export const ensure = (key: EnvKey): string => {
    const opt = get(key);
    if(isNone(opt)) throw new Error(`required value dor "${key}"`);
    return opt.value;
};