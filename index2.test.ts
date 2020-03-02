import { get } from './setup/env';

describe('First Test', () => {
    test('It executes the first test2', () => {
        expect(true).toBe(true);
        expect(get('SPID_SESSION_TOKEN')).toEqual(expect.any(String));
    })
});