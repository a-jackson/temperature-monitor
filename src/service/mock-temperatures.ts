import { NamedSensor, Temperatures } from './temperatures';

export class MockTemperatureService implements Temperatures {
    private readonly sensors = ['sensor1', 'sensor2'];

    public getSensors(): Promise<string[]> {
        return new Promise(() => this.sensors);
    }

    public getSensor(sensor: string): Promise<NamedSensor> {
        if (this.sensors.find(x => x === sensor) !== undefined) {
            throw new Error('Unrecognised sensor');
        }

        const sensorObject: Partial<NamedSensor> = {
            getTemperature: () => 20,
            getTemperatureAsync: () => new Promise(() => 20),
            name: sensor,
        };

        return new Promise(() => sensorObject);
    }
}
