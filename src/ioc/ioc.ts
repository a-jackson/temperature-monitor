import { Container, inject, interfaces } from 'inversify';
import {
    autoProvide,
    makeFluentProvideDecorator,
    makeProvideDecorator,
} from 'inversify-binding-decorators';
import TYPES from '../constant/types';
import { MockTemperatureService } from '../service/mock-temperatures';
import { Temperatures, TemperatureService } from '../service/temperatures';
const container = new Container();

if (process.argv.find(x => x === '--mock')) {
    container
        .bind<Temperatures>(TYPES.TemperatureService)
        .to(MockTemperatureService);
} else {
    container
        .bind<Temperatures>(TYPES.TemperatureService)
        .to(TemperatureService);
}

const provide = makeProvideDecorator(container);
const fluentProvider = makeFluentProvideDecorator(container);

const provideNamed = (
    identifier: interfaces.ServiceIdentifier<any>,
    name: string,
) =>
    fluentProvider(identifier)
        .whenTargetNamed(name)
        .done();

export { container, autoProvide, provide, provideNamed, inject };
