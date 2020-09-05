import { Application } from "express";
import methodOverride from 'method-override';
import exphbs  from 'express-handlebars';
import path  from 'path';
import stack from './stack';
import iis_proxy_support from './iis_proxy_support';
import * as bodyParser from 'body-parser';

const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'layout.hbs',
    layoutsDir: path.resolve(`${__dirname}/../../resources/views`),
    partialsDir: path.resolve(`${__dirname}/../../resources/views`),
    helpers: {
        select: function (selected: any, option: any) {
            return (selected == option) ? 'selected' : '';
        },
    }
});

export default (app: Application): void => {
    app.set('trust proxy', true);
    app.use(iis_proxy_support);

    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.set('views', path.resolve(`${__dirname}/../../resources/views`));
    app.use(bodyParser.urlencoded({"extended": true}));
    app.use(stack);
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            const method = req.body._method;
            delete req.body._method;

            return method;
        }
    }));
}
