import { EventEmitter } from 'events';
import { TemperatureSet } from '../models/temperature-set';
import { average, standardError } from '../utils/maths';
import { NamedSensor, Temperatures } from './temperatures';

export class TemperatureRepository extends EventEmitter {
    private readonly temperatureDeadband = 0.5;
    private readonly maxReadingAge = 5 * 60 * 1000; // 5 minutes
    private sensors: NamedSensor[];
    private currentValues: { [name: string]: { time: Date; temp: number } };

    constructor(private temperatures: Temperatures) {
        super();
        this.sensors = [];
        this.currentValues = {};
    }

    public async init() {
        const sensorNames = await this.temperatures.getSensors();
        for (const sensorName of sensorNames) {
            const sensor = await this.temperatures.getSensor(sensorName);
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

        if (this.currentValues[sensorName]) {
            if (
                this.isWithinValueDeadband(sensorName, newTemp) &&
                this.isWithinTimeDeadband(sensorName, now)
            ) {
                return;
            }
        }

        this.currentValues[sensorName] = { time: now, temp: newTemp };
        if (this.allSensorsHaveValue()) {
            const temperatureSet = this.createNewTemperatureSet(now);
            this.emit('change', temperatureSet);
        }
    }

    private createNewTemperatureSet(now: Date) {
        const valuesWithinTimeRange: number[] = [];
        for (const sensor of this.sensors) {
            const currentValue = this.currentValues[sensor.name];
            if (
                now.getTime() - currentValue.time.getTime() <
                this.maxReadingAge
            ) {
                valuesWithinTimeRange.push(currentValue.temp);
            }
        }

        let numberExcluded = this.sensors.length - valuesWithinTimeRange.length;
        const stdErr = standardError(valuesWithinTimeRange);
        const mean = average(valuesWithinTimeRange);
        const valuesWithinRange = valuesWithinTimeRange.filter(
            value => value < mean + stdErr && value > mean - stdErr,
        );
        numberExcluded +=
            valuesWithinTimeRange.length - valuesWithinRange.length;

        return {
            average: average(valuesWithinRange),
            numberExcluded,
            rawValues: valuesWithinRange,
        } as TemperatureSet;
    }

    private isWithinValueDeadband(sensorName: string, newTemp: number) {
        const difference = Math.abs(
            this.currentValues[sensorName].temp - newTemp,
        );
        return difference < this.temperatureDeadband;
    }

    private isWithinTimeDeadband(sensorName: string, now: Date) {
        return (
            now.getTime() - this.currentValues[sensorName].time.getTime() <
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
