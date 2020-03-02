import { askSessionToken } from './prompt';
import { get as getEnvValue, set as setEnvValue } from './env';

const testSuiteSetup = async () => {
    if(getEnvValue('SPID_SESSION_TOKEN')) return;
    
    const sessionToken = await askSessionToken();
    setEnvValue('SPID_SESSION_TOKEN', sessionToken);
};

export default testSuiteSetup;
