import { App } from './app';
import { Config } from './config';
import { DatabaseService } from './service/database';
import { MockTemperatureService } from './service/mock-temperatures';
import { TemperatureRepository } from './service/temperature-repository';
import { Temperatures, TemperatureService } from './service/temperatures';

export class Ioc {
    public async init() {
        let temperatures: Temperatures;
        if (process.argv.find(x => x === '--mock')) {
            temperatures = new MockTemperatureService();
        } else {
            temperatures = new TemperatureService();
        }

        const config = new Config();
        await config.loadConfig();
        const temperatureRepository = new TemperatureRepository(
            temperatures,
            config.config.temp,
        );
        const database = new DatabaseService(config.config.database, config.config.host);
        const app = new App(temperatureRepository, database);

        return app;
    }
}
