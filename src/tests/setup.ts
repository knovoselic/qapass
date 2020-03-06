import ServiceProvider from '../services/ServiceProvider';
import { Container } from 'inversify';
import knexConnection from 'knex';

export async function clearDB() {
    const container = global.container as Container;

    const knex_connection = container.get<knexConnection>('knex');

    await knex_connection.table('users').delete();
}

beforeAll(async () => {
    const sp = await ServiceProvider.get();

    (<any> global).serviceProvider = sp;

    const container = await sp.getContainer();

    global.container = container;

    const knex_connection = container.get<knexConnection>('knex');

    await knex_connection.migrate.latest();
});

afterEach(async () => {
    jest.restoreAllMocks();

    await clearDB();
});

afterAll(async () => {
    const sp = await ServiceProvider.get();

    (<any> global).serviceProvider = sp;

    const container = await sp.getContainer();

    const knex_connection = container.get<knexConnection>('knex');

    await knex_connection.migrate.rollback();
});
