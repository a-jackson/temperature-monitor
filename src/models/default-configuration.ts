import * as os from 'os';
import { Configuration } from './configuration';

const defaultConfig: Configuration = {
    database: {
        host: 'pi.hole',
        name: 'sensors',
    },
    host: {
        hostName: os.hostname(),
        location: undefined,
    },
    temp: {
        maxReadingAge: 60000,
        temperatureDeadband: 0.5,
    },
};

export default defaultConfig;
