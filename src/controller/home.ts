import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
} from 'inversify-express-utils';
import { ExceptionResult } from 'inversify-express-utils/dts/results';
import TYPES from '../constant/types';
import { Temperatures } from '../service/temperatures';

@controller('/')
export class HomeController extends BaseHttpController {
    constructor(
        @inject(TYPES.TemperatureService) private temperatures: Temperatures,
    ) {
        super();
    }

    @httpGet('/')
    public async get(): Promise<string[] | ExceptionResult> {
        try {
            return await this.temperatures.getSensors();
        } catch (error) {
            return this.internalServerError(error);
        }
    }
}
