import ServiceProvider from '../services/ServiceProvider';
import { initialiseTestTransactions } from 'typeorm-test-transactions';
import { getConnection } from 'typeorm';
import knex from 'knex';

initialiseTestTransactions();

beforeAll(async () => {
    const sp = await ServiceProvider.get();

    (<any>global).sp = sp;

    const container = await sp.getContainer();

    global.container = container;

    let port = 3306;

    if(process.env.DB_PORT) {
        port = parseInt(process.env.DB_PORT);
    }

    const knexInstance = knex({
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: port
        }
    });
    
    await knexInstance.migrate.latest().finally(() => {
        return knexInstance.destroy();
    });
});

afterAll(async () => {
    await getConnection().close();
});

afterEach(() => jest.restoreAllMocks());
