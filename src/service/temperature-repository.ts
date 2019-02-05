import { EventEmitter } from 'events';
import { TemperatureConfig } from '../models/configuration';
import { TemperatureSet } from '../models/temperature-set';
import { average, standardError } from '../utils/maths';
import { NamedSensor, Temperatures } from './temperatures';

export class TemperatureRepository extends EventEmitter {
    private readonly temperatureDeadband: number;
    private readonly maxReadingAge: number;
    private sensors: NamedSensor[];
    private currentValues: { [name: string]: { time: Date; temp: number } };
    private currentTemperatureSet: TemperatureSet;

    constructor(private temperatures: Temperatures, config: TemperatureConfig) {
        super();
        this.sensors = [];
        this.currentValues = {};
        this.temperatureDeadband = config.temperatureDeadband;
        this.maxReadingAge = config.maxReadingAge;
    }

    public async init() {
        const sensorNames = await this.temperatures.getSensors();
        for (const sensorName of sensorNames) {
            const sensor = await this.temperatures.getSensor(sensorName);
            if (!sensor) {
                continue;
            }

            sensor.on('change', newTemp =>
                this.temperatureChanged(sensorName, newTemp),
            );
            this.sensors.push(sensor);
        }
    }

    private temperatureChanged(sensorName: string, newTemp: number | false) {
        if (!newTemp) {
            newTemp = 0;
        }

        const now = new Date();

        this.currentValues[sensorName] = { time: now, temp: newTemp };
        if (this.allSensorsHaveValue()) {
            const temperatureSet = this.createNewTemperatureSet(now);
            if (
                !this.isWithinValueDeadband(temperatureSet) ||
                !this.isWithinTimeDeadband(temperatureSet)
            ) {
                this.emit('change', temperatureSet);
                this.emit('rawchange', { sensorName, temp: newTemp });
                this.currentTemperatureSet = temperatureSet;
            }
        }
    }

    private createNewTemperatureSet(now: Date) {
        const values = this.sensors.map(x => this.currentValues[x.name].temp);
        const numberExcluded = 0;
        const stdErr = standardError(values);
        const avg = average(values);

        return {
            average: avg,
            numberExcluded,
            stdErr,
            time: now,
        } as TemperatureSet;
    }

    private isWithinValueDeadband(newTemperatureSet: TemperatureSet) {
        if (!this.currentTemperatureSet) {
            return false;
        }
        const difference = Math.abs(
            this.currentTemperatureSet.average - newTemperatureSet.average,
        );
        return difference < this.temperatureDeadband;
    }

    private isWithinTimeDeadband(newTemperatureSet: TemperatureSet) {
        if (!this.currentTemperatureSet) {
            return false;
        }
        return (
            newTemperatureSet.time.getTime() -
                this.currentTemperatureSet.time.getTime() <
            this.maxReadingAge
        );
    }

    private allSensorsHaveValue() {
        for (const sensor of this.sensors) {
            if (!this.currentValues[sensor.name]) {
                return false;
            }
        }

        return true;
    }
}
