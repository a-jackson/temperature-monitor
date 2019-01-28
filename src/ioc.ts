import { App } from './app';
import { Config } from './config';
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
        const app = new App(temperatureRepository);

        return app;
    }
}
