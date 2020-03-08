import { Request, Response, NextFunction } from 'express';
import * as helpers from '../../../helpers';
import User from '../../../entity/User';
import { Repository, Connection } from 'typeorm';
import AccountController from '../../../controllers/AccountController';
import Account from '../../../entity/Account';
import AccountIndexPageTransformer from '../../../transformers/AccountIndexPageTransformer';
import Exception from '../../../errors/Exception';
import { runInTransaction } from 'typeorm-test-transactions';

let validationHelperSpy: jest.SpyInstance,
    find: jest.Mock, findOne: jest.Mock,
    save: jest.Mock, update: jest.Mock,
    deleteFn: jest.Mock,
    repo: Repository<Account>,
    transformArray: jest.Mock,
    transformer: AccountIndexPageTransformer,
    controller : AccountController,
    renderSpy: jest.SpyInstance,
    csrf: jest.Mock,
    req: Request,
    redirect: jest.Mock,
    res:  Response,
    next: NextFunction,
    typeorm: Connection;

beforeEach(async () => {
    validationHelperSpy = jest.spyOn(helpers, 'validation_errors')

    validationHelperSpy.mockImplementation(jest.fn());

    typeorm = helpers.typeorm();

    find = jest.fn();
    findOne = jest.fn();
    save = jest.fn();
    update = jest.fn();
    deleteFn = jest.fn();

    repo = {
        find: find as Function,
        findOne: findOne as Function,
        save: save as Function,
        update: update as Function,
        delete: deleteFn as Function,
    } as Repository<Account>;

    transformArray = jest.fn();

    transformer = {
        transformArray: transformArray as Function,
    } as AccountIndexPageTransformer;

    controller = new AccountController(repo, transformer);

    renderSpy = jest.spyOn(<any>controller, 'render');

    renderSpy.mockImplementation(jest.fn());

    csrf = jest.fn();

    req = {
        csrfToken: csrf as Function,
        body: {}
    } as Request;

    redirect = jest.fn();

    res = {
        redirect: redirect as Function
    } as Response;

    next = jest.fn() as NextFunction;
});

describe('AccountController.get', () => {
    it("returns rendered page", runInTransaction(async () => {
        const user: User = await typeorm.getRepository(User).save({
            email: 'test@test.com',
            password: '123123'
        });

        const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

        authUserSpy.mockImplementation(() => user);

        await controller.index(req, res, next);

        expect(authUserSpy).toHaveBeenCalledTimes(1);
        expect(authUserSpy).toHaveBeenLastCalledWith(req);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenLastCalledWith({
            where: [
                {user_id: user.id},
                {public: true},
            ],
            relations: ['user']
        });
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenLastCalledWith(res, 'account-manager/index', expect.anything());
    }));
});

describe('AccountController.create', () => {
    it("returns rendered page", async () => {
        await controller.create(req, res, next);

        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenLastCalledWith(res, 'account-manager/create', expect.anything());
    });
});

describe('AccountController.store', () => {
    describe('when no database error', () => {
        it("saves account and redirects user", runInTransaction(async () => {
            const user: User = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

            authUserSpy.mockImplementation(() => user);

            await controller.store(req, res, next);

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(save).toHaveBeenCalledTimes(1);
            expect(save).toHaveBeenLastCalledWith({
                user_id: user.id,
                username: undefined,
                password: undefined,
                host: undefined,
                description: undefined,
                public: undefined,
            });

            expect(redirect).toHaveBeenCalledTimes(1);
            expect(redirect).toHaveBeenLastCalledWith('/');
        }));
    });
    describe('when database error', () => {
        it("throws 'Internal error' exception", runInTransaction(async () => {
            const user: User = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

            authUserSpy.mockImplementation(() => user);

            save.mockImplementationOnce(() => {
                throw new Exception('Internal error.', 500)
            });

            let error;

            try {
                await controller.store(req, res, next);
            } catch (e) {
                error = e;
            }

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(save).toHaveBeenCalledTimes(1);
            expect(save).toHaveBeenLastCalledWith({
                user_id: user.id,
                username: undefined,
                password: undefined,
                host: undefined,
                description: undefined,
                public: undefined,
            });

            expect(error).toMatchObject(new Exception('Internal error.', 500));
        }));
    });
});

describe('AccountController.edit', () => {
    describe('when record exists', () => {
        it("returns rendered page", runInTransaction(async () => {
            const user: User = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

            authUserSpy.mockImplementation(() => user);

            findOne.mockImplementationOnce(() => {
                return '1';
            });

            await controller.edit('1', req, res, next);

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(findOne).toHaveBeenCalledTimes(1);
            expect(findOne).toHaveBeenLastCalledWith('1', {where: [
                {user_id: user.id},
                {public: true},
            ]});

            expect(renderSpy).toHaveBeenCalledTimes(1);
            expect(renderSpy).toHaveBeenLastCalledWith(res, 'account-manager/edit', expect.anything());
        }));
    });
    describe("when record doesn't exist", () => {
        it("throws 'Not found.' error", runInTransaction(async () => {
            const user: User = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

            authUserSpy.mockImplementation(() => user);

            findOne.mockImplementationOnce(() => undefined);

            let error;

            try {
                await controller.edit('1', req, res, next);
            } catch (e) {
                error = e;
            }

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(findOne).toHaveBeenCalledTimes(1);
            expect(findOne).toHaveBeenLastCalledWith('1', {where: [
                {user_id: user.id},
                {public: true},
            ]});

            expect(error).toMatchObject(new Exception('Not found.', 404));
        }));
    });
});

describe('AccountController.update', () => {
    describe('when record exists', () => {
        it("updates account and redirects to root page", runInTransaction(async () => {
            const user: User = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

            authUserSpy.mockImplementation(() => user);

            findOne.mockImplementationOnce(() => {
                return '1';
            });

            await controller.update('1', req, res, next);

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(findOne).toHaveBeenCalledTimes(1);
            expect(findOne).toHaveBeenLastCalledWith('1', {where: [
                {user_id: user.id},
                {public: true},
            ]});

            expect(update).toHaveBeenCalledTimes(1);
            expect(update).toHaveBeenLastCalledWith('1', {
                user_id: user.id,
                username: req.body.username,
                password: req.body.account_password,
                host: req.body.host,
                description: req.body.description,
                public: req.body.public
            });

            expect(redirect).toHaveBeenCalledTimes(1);
            expect(redirect).toHaveBeenLastCalledWith('/');
        }));
    });
    describe("when record doesn't exist", () => {
        it("throws 'Not found.' error", runInTransaction(async () => {
            const user: User = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

            authUserSpy.mockImplementation(() => user);

            findOne.mockImplementationOnce(() => undefined);

            let error;

            try {
                await controller.update('1', req, res, next);
            } catch (e) {
                error = e;
            }

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(findOne).toHaveBeenCalledTimes(1);
            expect(findOne).toHaveBeenLastCalledWith('1', {where: [
                {user_id: user.id},
                {public: true},
            ]});

            expect(error).toMatchObject(new Exception('Not found.', 404));
        }));
    });
});

describe('AccountController.delete', () => {
    describe('when record exists', () => {
        it("deletes account and redirects to root page", runInTransaction(async () => {
            const user: User = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

            authUserSpy.mockImplementation(() => user);

            findOne.mockImplementationOnce(() => {
                return '1';
            });

            await controller.delete('1', req, res, next);

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(findOne).toHaveBeenCalledTimes(1);
            expect(findOne).toHaveBeenLastCalledWith('1', {where: [
                {user_id: user.id},
                {public: true},
            ]});

            expect(deleteFn).toHaveBeenCalledTimes(1);
            expect(deleteFn).toHaveBeenLastCalledWith('1');

            expect(redirect).toHaveBeenCalledTimes(1);
            expect(redirect).toHaveBeenLastCalledWith('/');
        }));
    });
    describe("when record doesn't exist", () => {
        it("throws 'Not found.' error", runInTransaction(async () => {
            const user: User = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const authUserSpy: jest.SpyInstance = jest.spyOn(helpers, 'auth_user')

            authUserSpy.mockImplementation(() => user);

            findOne.mockImplementationOnce(() => undefined);

            let error;

            try {
                await controller.delete('1', req, res, next);
            } catch (e) {
                error = e;
            }

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(findOne).toHaveBeenCalledTimes(1);
            expect(findOne).toHaveBeenLastCalledWith('1', {where: [
                {user_id: user.id},
                {public: true},
            ]});

            expect(error).toMatchObject(new Exception('Not found.', 404));
        }));
    });
});