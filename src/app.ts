import { DatabaseService } from './service/database';
import { TemperatureRepository } from './service/temperature-repository';

export class App {
    constructor(
        private temperatureRepository: TemperatureRepository,
        private database: DatabaseService,
    ) {}
    public async run() {
        this.database.init();
        this.temperatureRepository.on(
            'change',
            async x => await this.database.writeTemperatureSet(x),
        );
        this.temperatureRepository.on(
            'rawchange',
            async x => await this.database.writeRawTemperature(x),
        );
        await this.temperatureRepository.init();
    }
}
