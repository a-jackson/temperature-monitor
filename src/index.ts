import { Ioc } from './ioc';

const ioc = new Ioc();
ioc.init().then(app => app.run());
