import 'reflect-metadata';
// tslint:disable-next-line:ordered-imports - reflect-metadata must be first.
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './ioc/ioc';

// load all injectable entities.
// the @provide() annotation will then automatically register them.
import './ioc/loader';

// start the server
const server = new InversifyExpressServer(container);

server.setConfig((application) => {
  application.use(bodyParser.urlencoded({
    extended: true
  }));
  application.use(bodyParser.json());
  application.use(helmet());
});

const app = server.build();
app.listen(8000);
console.log('Server started on port 8000 :)');

exports = module.exports = app;
