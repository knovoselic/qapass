import ServiceProvider from '../services/ServiceProvider';

process.env.DB_HOST = process.env.DB_TEST_HOST;
process.env.DB_PORT = process.env.DB_TEST_PORT;
process.env.DB_USERNAME = process.env.DB_TEST_USERNAME;
process.env.DB_PASSWORD = process.env.DB_TEST_PASSWORD;
process.env.DB_DATABASE = process.env.DB_TEST_DATABASE;

beforeAll(async () => {
    const sp = await ServiceProvider.get();

    (<any> global).serviceProvider = sp;

    global.container = await sp.getContainer();
});

