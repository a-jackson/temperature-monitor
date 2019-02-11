import { EventEmitter } from 'events';
import { TemperatureConfig } from '../models/configuration';
import { RawTemperature } from '../models/raw-temperature';
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
            return;
        }

        const now = new Date();
        this.emit('rawchange', {
            sensorName,
            temp: newTemp,
            time: now,
        } as RawTemperature);

        this.currentValues[sensorName] = { time: now, temp: newTemp };
        const temperatureSet = this.createNewTemperatureSet(now);
        if (
            !this.isWithinValueDeadband(temperatureSet) ||
            !this.isWithinTimeDeadband(temperatureSet)
        ) {
            this.emit('change', temperatureSet);
            this.currentTemperatureSet = temperatureSet;
        }
    }

    private createNewTemperatureSet(now: Date) {
        const values = this.sensors
            .filter(x => this.currentValues[x.name])
            .map(x => this.currentValues[x.name].temp);
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
}
