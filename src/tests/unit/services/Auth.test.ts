import { Request } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../../entity/User';
import { Connection, createConnection } from 'typeorm';
import { Container } from 'inversify';
import Auth from '../../../services/Auth';

describe('Auth.login', () => {
    describe('when invalid email and password combination', () => {
        it("resolves to 'Invalid email or password.' error", async () => {
            const container: Container = global.container;

            const auth = container.get<Auth>('Auth');

            const done = jest.fn();

            const email = 'test@test.com';
            const pass = '123123';

            const req = {} as Request;

            await auth.login(req, email, pass, done)
                .then(fulfilled => {
                    expect(done).toHaveBeenCalledTimes(1);
                    expect(done).toHaveBeenLastCalledWith(
                        null, false, {message: 'Invalid email or password.'}
                    );
                });

            const typeorm = container.get<Connection>('typeorm');

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(pass, salt);

            await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: hash
            });

            await auth.login(req, email, pass + '1', done)
                .then(fulfilled => {
                    expect(done).toHaveBeenCalledTimes(2);
                    expect(done).toHaveBeenLastCalledWith(
                        null, false, {message: 'Invalid email or password.'}
                    );
                });
        });
    });
    describe('when valid credentials', () => {
        it("resolves to User instance", async () => {
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

            await auth.login(
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
});

describe('Auth.register', () => {
    describe('when no database transaction error', () => {
        it("resolves to User instance", async () => {
            const container: Container = global.container;

            const typeorm = container.get<Connection>('typeorm');

            const auth = container.get<Auth>('Auth');

            const done = jest.fn();

            const email = 'test@test.com';

            await auth.register(
                <Request> {},
                email,
                '123123',
                done
            ).then(async fulfilled => {
                await typeorm.getRepository(User).findOne({'email': email}).
                    then(f => {
                        /**
                         * Hack for typeorm.
                         * Find method returns id as string, while save returns it as integer.
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
    });
    describe('when database transaction throws error', () => {
        it("resolves to that error", async () => {
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

            await auth.register(
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
});