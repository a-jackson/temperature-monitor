import { Container, inject, interfaces } from 'inversify';
import {
    autoProvide,
    makeFluentProvideDecorator,
    makeProvideDecorator,
} from 'inversify-binding-decorators';
const container = new Container();

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
