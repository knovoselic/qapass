import { Request } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../../entity/User';
import { Connection, createConnection } from 'typeorm';
import { Container } from 'inversify';
import Auth from '../../../services/Auth';

describe('Auth.loginStrategyCallback should', () => {
    it("resolve to error on non existing email", async () => {
        const container: Container = global.container;

        const auth = container.get<Auth>('Auth');

        const done = jest.fn();

        await auth.loginStrategyCallback(
            <Request> {},
            'non@existing.email',
            '123123',
            done
        ).then(fulfilled => {
            expect(done).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenLastCalledWith(
                null, false, {message: 'Invalid email or password.'}
            );
        });
    });
    it("resolve to error on invalid password", async () => {
        const container: Container = global.container;

        const typeorm = container.get<Connection>('typeorm');

        const pass = '123123';

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(pass, salt);

        const usr = await typeorm.getRepository(User).save({
            email: 'test@test.com',
            password: hash
        });

        const auth = container.get<Auth>('Auth');

        const done = jest.fn();

        await auth.loginStrategyCallback(
            <Request> {},
            usr.email,
            pass + '1',
            done
        ).then(fulfilled => {
            expect(done).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenLastCalledWith(
                null, false, {message: 'Invalid email or password.'}
            );
        });
    });
    it("resolve to user for valid credentials", async () => {
        const container: Container = global.container;

        const typeorm = container.get<Connection>('typeorm');

        const email = 'test@test.com';
        const pass = '123123';

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(pass, salt);

        await typeorm.getRepository(User).save({
            email: email,
            password: hash
        });

        const usr = await typeorm.getRepository(User).findOne({'email': email});

        const auth = container.get<Auth>('Auth');

        const done = jest.fn();

        await auth.loginStrategyCallback(
            <Request> {},
            email,
            pass,
            done
        ).then(fulfilled => {
            expect(done).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenLastCalledWith(null, usr);
        });
    });
});

describe('Auth.registerStrategyCallback should', () => {
    it("resolve to user if no db connection error", async () => {
        const container: Container = global.container;

        const typeorm = container.get<Connection>('typeorm');

        const auth = container.get<Auth>('Auth');

        const done = jest.fn();

        const email = 'test@test.com';

        await auth.registerStrategyCallback(
            <Request> {},
            email,
            '123123',
            done
        ).then(async fulfilled => {
            await typeorm.getRepository(User).findOne({'email': email}).
                then(f => {
                    /**
                     * Hack for typeorm find returns id as string,
                     * while save returns it as integer
                     */
                    if(f) {
                        if(typeof f.id === 'string') {
                            f.id = parseInt(f.id);
                        }
                    }

                    expect(done).toHaveBeenCalledTimes(1);
                    expect(done).toHaveBeenLastCalledWith(null, f);
                })

        });
    });
    it("resolve to error if save throws error", async () => {
        const container: Container = global.container;

        const typeorm = container.get<Connection>('typeorm');

        const email = 'test@test.com';
        const pass = '123123';

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(pass, salt);

        await typeorm.getRepository(User).save({
            email: email,
            password: hash
        });

        await typeorm.getRepository(User).findOne({'email': email});

        const auth = container.get<Auth>('Auth');

        const done = jest.fn((...args) => {

        });

        await auth.registerStrategyCallback(
            <Request> {},
            email,
            pass,
            done
        ).then(async fulfilled => {
            expect(done).toHaveBeenCalledTimes(1);
            expect(done.mock.calls[0].length).toBe(3);
            expect(done.mock.calls[0][0]).toBe(null);
            expect(done.mock.calls[0][1]).toBe(false);
            expect(typeof done.mock.calls[0][2]).toBe('object');
            expect(typeof done.mock.calls[0][2].message).toBe('string');
        });
    });
});