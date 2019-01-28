export interface Configuration {
    host: HostConfig;
    temp: TemperatureConfig;
    database: DatabaseConfig;
}

export interface TemperatureConfig {
    maxReadingAge: number;
    temperatureDeadband: number;
}

export interface HostConfig {
    location: string;
    hostName: string;
}

export interface DatabaseConfig {
    host: string;
    name: string;
}
