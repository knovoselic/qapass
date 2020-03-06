import ServiceProvider from './services/ServiceProvider';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Application } from 'express';
import Exception from './errors/Exception';
import appConfig from './middlewares/config';
import ErrorHandler from './services/ErrorHandler';

class App {
    private serviceProvider: ServiceProvider;
    private application: Application;

    protected async build()
    {
        this.serviceProvider = await ServiceProvider.get();

        const container = this.serviceProvider.getContainer();

        let inversifyExpressServer = new InversifyExpressServer(container);

        global.container = container;

        inversifyExpressServer.setConfig(appConfig);

        const errorHandler = container.get<ErrorHandler>('ErrorHandler');

        inversifyExpressServer.setErrorConfig((app) => {
            app.get('*', function(req, res, next) {
                next(new Exception('Not found.', 404));
            });
            app.use(errorHandler.handle);
        });

        this.application = inversifyExpressServer.build();
    }

    public getApplication = async () => {
        if(!this.application) {
            await this.build();
        }

        return this.application;
    }

    public run = async (port: number) => {

        await this.getApplication();

        return this.application
            .listen(port)
            .setTimeout(10000);
    };
}

export default new App;