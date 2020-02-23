import ServiceProvider from './services/ServiceProvider';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import Exception from './errors/Exception';
import express from 'express';
import exphbs  from 'express-handlebars';
import errorHanlder from './services/ErrorHandler';
import path  from 'path';
import session from 'express-session';
import flash from 'connect-flash';

const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: '',
  layoutsDir: path.resolve(`${__dirname}/../resources/views`),
  partialsDir: path.resolve(`${__dirname}/../resources/views`),
});

let secret = 'secret';

if(process.env.APP_SECRET) {
  secret = process.env.APP_SECRET;
}

const ses = session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000
  }
});

class App {
  private serviceProvider: ServiceProvider;
  private server: InversifyExpressServer;

  protected async build()
  {
    this.serviceProvider = await ServiceProvider.get();

    const container = this.serviceProvider.getContainer();

    this.server = new InversifyExpressServer(container);

    global.container = container;

    this.server.setConfig((app) => {
      app.use(express.static(path.resolve(`${__dirname}/../public`)));
      app.engine('hbs', hbs.engine);
      app.set('view engine', 'hbs');
      app.set('views', path.resolve(`${__dirname}/../resources/views`));
      app.use(ses);
      app.use(flash);
      app.use(bodyParser.urlencoded({"extended": true}));
    });

    this.server.setErrorConfig((app) => {
      app.get('*', function(req, res, next) {
        next(new Exception('Not found', 404));
      });
      app.use(errorHanlder.handle);
    });
  }

  public run = async () => {

    await this.build();

    this.server
      .build()
      .listen(
        3000,
        () => console.log(`Server started`)
      );
  };
}

export default new App;