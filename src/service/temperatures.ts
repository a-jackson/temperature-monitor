import { getSensor, getSensorsUids, Sensor } from 'w1temp';

export interface Temperatures {
    getSensors(): Promise<string[]>;
    getSensor(sensor: string): Promise<NamedSensor>;
}

export interface NamedSensor extends Sensor {
    name: string;
}

export class TemperatureService implements Temperatures {
    public getSensors() {
        return getSensorsUids();
    }

    public async getSensor(sensorName: string) {
        try {
            const sensor = (await getSensor(
                sensorName,
                true,
                1000,
                false,
            )) as NamedSensor;
            sensor.name = sensorName;
            return sensor;
        } catch {
            return undefined;
        }
    }
}
