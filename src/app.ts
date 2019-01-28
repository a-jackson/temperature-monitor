import { TemperatureRepository } from './service/temperature-repository';

export class App {
    constructor(private temperatureRepository: TemperatureRepository) {}
    public async run() {
        this.temperatureRepository.on('change', console.log);
        await this.temperatureRepository.init();
    }
}
