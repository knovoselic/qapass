import unique from '../../../validators/unique';
import User from '../../../entity/User';
import { Connection } from 'typeorm';
import { Container } from 'inversify';

describe('unique', () => {
    describe('throws error', () => {
        it("when second argument is not string processable by json parse", async () => {
            await expect(unique('any', 'random')).rejects.toThrowError('Invalid exists schema.');
        });
        it("when second argument is string containing json with invalid schema", async () => {
            await expect(unique('any', JSON.stringify({}))).rejects.toThrowError('Invalid exists schema.');
        });
    });
    describe('returns false when', () => {
        it("second argument contains valid schema but first argument is not string", async () => {
            expect(
                await unique(1, JSON.stringify({
                    table: 'users',
                    column: 'email'
                }))
            ).toBe(false);
        });
        it("valid arguments but record exists", async () => {
            const container = global.container as Container;

            const typeorm = container.get<Connection>('typeorm');

            const usr = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            expect(
                await unique(usr.email, JSON.stringify({
                    table: 'users',
                    column: 'email'
                }))
            ).toBe(false);
        });
    });
    it("returns true when valid arguments and record doesn't exist", async () => {
        expect(
            await unique('1', JSON.stringify({
                table: 'users',
                column: 'email'
            }))
        ).toBe(true);
    });
});