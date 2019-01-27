import { App } from './app';
import { MockTemperatureService } from './service/mock-temperatures';
import { TemperatureRepository } from './service/temperature-repository';
import { Temperatures, TemperatureService } from './service/temperatures';

let temperatures: Temperatures;
if (process.argv.find((x) => x === '--mock')) {
    temperatures = new MockTemperatureService();
} else {
    temperatures = new TemperatureService();
}

const temperatureRepository = new TemperatureRepository(temperatures);
const app = new App(temperatureRepository);

app.run();
