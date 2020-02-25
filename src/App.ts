import ServiceProvider from './services/ServiceProvider';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import Exception from './errors/Exception';
import express from 'express';
import exphbs  from 'express-handlebars';
import errorHanlder from './services/ErrorHandler';
import path  from 'path';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import passport from 'passport';
import methodOverride from 'method-override';

let MemoryStore = require('memorystore')(expressSession);

const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: path.resolve(`${__dirname}/../resources/views`),
    partialsDir: path.resolve(`${__dirname}/../resources/views`),
    helpers: {
        select: function (selected: any, option: any) {
            return (selected == option) ? 'selected' : '';
        },
    }
});

let secret = 'secret';

if(process.env.APP_SECRET) {
    secret = process.env.APP_SECRET;
}

const session = expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    },
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
});

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});
passport.deserializeUser((user: any, done) => {
    done(null, user);
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
            app.use(cookieParser());
            app.use(session);
            app.use(passport.initialize());
            app.use(passport.session());
            app.use(flash());
            app.use(bodyParser.urlencoded({"extended": true}));
            app.use(methodOverride(function (req, res) {
                if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                    const method = req.body._method;
                    delete req.body._method;

                    return method;
                }
            }))
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
                () => console.log('Server started')
            )
            .setTimeout(10000);
    };
}

export default new App;