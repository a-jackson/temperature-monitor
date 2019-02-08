import { FieldType, InfluxDB, IPoint, ISingleHostConfig } from 'influx';
import { DatabaseConfig, HostConfig } from '../models/configuration';
import { RawTemperature } from '../models/raw-temperature';
import { TemperatureSet } from '../models/temperature-set';

interface TemperatureSchema {
    fields: {
        value: FieldType;
        numberExcluded: FieldType;
        stdErr: FieldType;
    };
    measurement: string;
    tags: ['host', 'location'];
}

interface RawTemperatureSchema {
    fields: {
        temperature: FieldType;
    };
    measurement: string;
    tags: ['host', 'location', 'name'];
}

export class DatabaseService {
    private influx: InfluxDB;
    constructor(
        private dbConfig: DatabaseConfig,
        private hostConfig: HostConfig,
    ) {}

    public init() {
        const schema: TemperatureSchema = {
            fields: {
                numberExcluded: FieldType.INTEGER,
                stdErr: FieldType.FLOAT,
                value: FieldType.FLOAT,
            },
            measurement: this.dbConfig.measurement,
            tags: ['host', 'location'],
        };
        const rawSchema: RawTemperatureSchema = {
            fields: {
                temperature: FieldType.FLOAT,
            },
            measurement: this.dbConfig.rawMeasurement,
            tags: ['host', 'location', 'name'],
        };
        const config: ISingleHostConfig = {
            database: this.dbConfig.name,
            host: this.dbConfig.host,
            schema: [schema, rawSchema],
        };
        this.influx = new InfluxDB(config);
    }

    public async writeTemperatureSet(temperatureSet: TemperatureSet) {
        await this.write(this.getPoint(temperatureSet));
    }

    public async writeRawTemperature(temperature: RawTemperature) {
        await this.write(this.getRawPoint(temperature));
    }

    private async write(point: IPoint) {
        try {
            await this.influx.writePoints([point]);
            console.log(point);
        } catch (err) {
            console.log('Failed to write to database: ' + err);
        }
    }

    private getPoint(temperatureSet: TemperatureSet): IPoint {
        return {
            fields: {
                numberExcluded: temperatureSet.numberExcluded,
                stdErr: temperatureSet.stdErr,
                value: temperatureSet.average,
            },
            measurement: this.dbConfig.measurement,
            tags: {
                host: this.hostConfig.hostName,
                location: this.hostConfig.location,
            },
        };
    }

    private getRawPoint(temperature: RawTemperature): IPoint {
        return {
            fields: {
                temperature: temperature.temp,
            },
            measurement: this.dbConfig.rawMeasurement,
            tags: {
                host: this.hostConfig.hostName,
                location: this.hostConfig.location,
                name: temperature.sensorName,
            },
        };
    }
}
