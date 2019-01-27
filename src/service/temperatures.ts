import { injectable } from 'inversify';
import { getSensor, getSensorsUids, Sensor } from 'w1temp';

export interface Temperatures {
    getSensors(): Promise<string[]>;
    getSensor(sensor: string): Promise<Sensor>;
}

@injectable()
export class TemperatureService implements Temperatures {
    public getSensors() {
        return getSensorsUids();
    }

    public getSensor(sensor: string) {
        return getSensor(sensor, false);
    }
}
