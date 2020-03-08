import unique from '../../../validators/unique';
import User from '../../../entity/User';
import { Connection } from 'typeorm';
import { Container } from 'inversify';
import { Request } from 'express';

const req = {} as Request;

describe('unique', () => {
    describe('when second argument is not a string processable by json parse or a string containing json with invalid schema', () => {
        it("throws error", async () => {
            await expect(unique(req, 'rnd', 'any', 'random')).rejects.toThrowError('Invalid exists schema.');
            await expect(unique(req, 'rnd', 'any', JSON.stringify({}))).rejects.toThrowError('Invalid exists schema.');
        });
    });
    describe('when second argument contains valid schema but first argument is not string', () => {
        it("returns false", async () => {
            expect(
                await unique(req, 'rnd', 1, JSON.stringify({
                    table: 'users',
                    column: 'email'
                }))
            ).toBe(false);
        });
    });
    describe('when valid arguments but record exists', () => {
        it("returns false", async () => {
            const container = global.container as Container;

            const typeorm = container.get<Connection>('typeorm');

            const usr = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            expect(
                await unique(req, 'rnd', usr.email, JSON.stringify({
                    table: 'users',
                    column: 'email'
                }))
            ).toBe(false);
        });
    });
    describe("when valid arguments and record doesn't exist", () => {
        it("returns true", async () => {
            expect(
                await unique(req, 'rnd', '1', JSON.stringify({
                    table: 'users',
                    column: 'email'
                }))
            ).toBe(true);
        });
    });
});