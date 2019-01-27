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
        const sensor = (await getSensor(sensorName)) as NamedSensor;
        sensor.name = sensorName;
        return sensor;
    }
}
