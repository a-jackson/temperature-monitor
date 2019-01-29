import * as os from 'os';
import { Configuration } from './configuration';

const defaultConfig: Partial<Configuration> = {
    host: {
        hostName: os.hostname(),
    },
    temp: {
        maxReadingAge: 60000,
        temperatureDeadband: 0.5,
    },
};

export default defaultConfig;
