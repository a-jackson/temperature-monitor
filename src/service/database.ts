import { FieldType, InfluxDB, IPoint, ISingleHostConfig } from 'influx';
import { DatabaseConfig, HostConfig } from '../models/configuration';
import { TemperatureSet } from '../models/temperature-set';

interface TemperatureSchema {
    fields: {
        average: FieldType;
        numberExcluded: FieldType;
        stdErr: FieldType;
    };
    measurement: string;
    tags: ['host', 'location'];
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
                average: FieldType.FLOAT,
                numberExcluded: FieldType.INTEGER,
                stdErr: FieldType.FLOAT,
            },
            measurement: this.dbConfig.measurement,
            tags: ['host', 'location'],
        };
        const config: ISingleHostConfig = {
            database: this.dbConfig.name,
            host: this.dbConfig.host,
            schema: [schema],
        };
        this.influx = new InfluxDB(config);
    }

    public async writeTemperatureSet(temperatureSet: TemperatureSet) {
        try {
            await this.influx.writePoints([this.getPoint(temperatureSet)]);
        } catch (err) {
            console.log('Failed to write to database: ' + err);
        }
    }

    private getPoint(temperatureSet: TemperatureSet): IPoint {
        return {
            fields: {
                average: temperatureSet.average,
                numberExcluded: temperatureSet.numberExcluded,
                stdErr: temperatureSet.stdErr,
            },
            measurement: this.dbConfig.measurement,
            tags: {
                host: this.hostConfig.hostName,
                location: this.hostConfig.location,
            },
        };
    }
}
