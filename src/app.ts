import { TemperatureRepository } from './service/temperature-repository';

export class App {
    constructor(private temperatureRepository: TemperatureRepository) {}
    public run() {
      this.temperatureRepository.on('change', console.log);
      this.temperatureRepository.init();
    }
}
