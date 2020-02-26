import ServiceProvider from './services/ServiceProvider';
import { InversifyExpressServer } from 'inversify-express-utils';
import Exception from './errors/Exception';
import errorHanlder from './services/ErrorHandler';
import appConfig from './middlewares/config';

class App {
    private serviceProvider: ServiceProvider;
    private server: InversifyExpressServer;

    protected async build()
    {
        this.serviceProvider = await ServiceProvider.get();

        const container = this.serviceProvider.getContainer();

        this.server = new InversifyExpressServer(container);

        global.container = container;

        this.server.setConfig(appConfig);

        this.server.setErrorConfig((app) => {
            app.get('*', function(req, res, next) {
                next(new Exception('Not found.', 404));
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