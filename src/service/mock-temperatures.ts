import { injectable } from 'inversify';
import { Sensor } from 'w1temp';
import { Temperatures } from './temperatures';

@injectable()
export class MockTemperatureService implements Temperatures {
    private readonly sensors = ['sensor1', 'sensor2'];

    public getSensors(): Promise<string[]> {
        return new Promise(() => this.sensors);
    }

    public getSensor(sensor: string): Promise<Sensor> {
        if (this.sensors.find(x => x === sensor) !== undefined) {
            throw new Error('Unrecognised sensor');
        }

        const sensorObject: Partial<Sensor> = {
            getTemperature: () => 20,
            getTemperatureAsync: () => new Promise(() => 20),
        };

        return new Promise(() => sensorObject);
    }
}
