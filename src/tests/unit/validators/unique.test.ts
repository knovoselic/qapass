import unique from '../../../validators/unique';
import ServiceProvider from '../../../services/ServiceProvider';
import knexConnection  from "knex";
import User from '../../../entity/User';
import { Connection } from 'typeorm';

describe('Function unique should', () => {
    beforeEach(async () => {
        const sp = await ServiceProvider.get();

        const container = sp.getContainer();

        const knex_connection = container.get<knexConnection>('knex');

        return await knex_connection.table('users').delete();
    });
    it("throw error when second argument is not string processable by json parse", async () => {
        await expect(unique('any', 'random')).rejects.toThrowError('Invalid exists schema.');
    });
    it("throw error when second argument is string containing json with invalid schema", async () => {
        await expect(unique('any', JSON.stringify({}))).rejects.toThrowError('Invalid exists schema.');
    });
    it("return false when second argument contains valid schema but first argument is not string", async () => {
        expect(
            await unique(1, JSON.stringify({
                table: 'users',
                column: 'email'
            }))
        ).toBe(false);
    });
    it("return false when valid arguments but record exists", async () => {
        const sp = await ServiceProvider.get();

        const container = sp.getContainer();

        global.container = container;

        const typeorm = container.get<Connection>('typeorm');

        const u = await typeorm.getRepository(User).save({
            email: 'test@test.com',
            password: '123123'
        });

        expect(
            await unique(u.email, JSON.stringify({
                table: 'users',
                column: 'email'
            }))
        ).toBe(false);
    });
    it("return true when valid arguments and record doesn't exist", async () => {
        const sp = await ServiceProvider.get();

        global.container = sp.getContainer();

        expect(
            await unique('1', JSON.stringify({
                table: 'users',
                column: 'email'
            }))
        ).toBe(true);
    });
});