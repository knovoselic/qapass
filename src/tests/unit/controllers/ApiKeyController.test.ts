import { Request, Response, NextFunction } from 'express';
import * as helpers from '../../../helpers';
import User from '../../../entity/User';
import { getRepository, Repository } from 'typeorm';
import ApiKeyController from '../../../controllers/ApiKeyController';
import ApiKey from '../../../entity/ApiKey';
import ApiKeyListTransformer from '../../../transformers/ApiKeyListTransformer';
import Exception from '../../../errors/Exception';

var user: User,
    authUserSpy: jest.SpyInstance,
    validationHelperSpy: jest.SpyInstance,
    find: jest.Mock, findOne: jest.Mock,
    save: jest.Mock, update: jest.Mock,
    deleteFn: jest.Mock,
    repo: Repository<ApiKey>,
    transformArray: jest.Mock,
    transformer: ApiKeyListTransformer,
    controller : ApiKeyController,
    renderSpy: jest.SpyInstance,
    csrf: jest.Mock,
    flash: jest.Mock,
    req: Request,
    redirect: jest.Mock,
    res:  Response,
    next: NextFunction;

beforeEach(async () => {
    user = await getRepository(User).save({
        email: 'test@test.com',
        password: '123123'
    });

    authUserSpy = jest.spyOn(helpers, 'auth_user')

    authUserSpy.mockImplementation(() => user);

    validationHelperSpy = jest.spyOn(helpers, 'validation_errors')

    validationHelperSpy.mockImplementation(jest.fn());

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
    } as Repository<ApiKey>;

    transformArray = jest.fn();

    transformer = {
        transformArray: transformArray as Function,
    } as ApiKeyListTransformer;

    controller = new ApiKeyController(repo, transformer);

    renderSpy = jest.spyOn(<any>controller, 'render');

    renderSpy.mockImplementation(jest.fn());

    csrf = jest.fn();
    flash = jest.fn(() => []);

    req = {
        csrfToken: csrf as Function,
        flash: flash as Function,
        body: {}
    } as Request;

    redirect = jest.fn();

    res = {
        redirect: redirect as Function
    } as Response;

    next = jest.fn() as NextFunction;
});

describe('ApiKeyController.get', () => {
    it("returns rendered page", async () => {
        await controller.index(req, res, next);

        flash.mockImplementationOnce(() => [JSON.stringify({})]);

        expect(authUserSpy).toHaveBeenCalledTimes(1);
        expect(authUserSpy).toHaveBeenLastCalledWith(req);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenLastCalledWith({where: [
            {user_id: user.id},
        ]});
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenLastCalledWith(res, 'api-keys/index', expect.anything());

        await controller.index(req, res, next);

        expect(authUserSpy).toHaveBeenCalledTimes(2);
        expect(authUserSpy).toHaveBeenLastCalledWith(req);
        expect(find).toHaveBeenCalledTimes(2);
        expect(find).toHaveBeenLastCalledWith({where: [
            {user_id: user.id},
        ]});
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(renderSpy).toHaveBeenLastCalledWith(res, 'api-keys/index', expect.anything());
    });
});

describe('ApiKeyController.generate', () => {
    describe('when no database error', () => {
        it("it saves api key and redirects to /api-keys page", async () => {
            save.mockImplementationOnce(() => {
                return {};
            });

            await controller.generate(req, res, next);

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);
            expect(save).toHaveBeenCalledTimes(1);
            expect(save).toHaveBeenLastCalledWith(expect.anything());
            expect(flash).toHaveBeenCalledTimes(1);
            expect(flash).toHaveBeenLastCalledWith('generated', JSON.stringify({}));
            expect(redirect).toHaveBeenCalledTimes(1);
            expect(redirect).toHaveBeenLastCalledWith('/api-keys');
        });
    });
    describe('when database error', () => {
        it("throws 'Internal error' exception", async () => {
            save.mockImplementationOnce(() => {
                throw new Exception('Internal error.', 500)
            });

            let error;

            try {
                await controller.generate(req, res, next);
            } catch (e) {
                error = e;
            }

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(save).toHaveBeenCalledTimes(1);
            expect(save).toHaveBeenLastCalledWith(expect.anything());

            expect(error).toMatchObject(new Exception('Internal error.', 500));
        });
    });
});

describe('ApiKeyController.delete', () => {
    describe('when record exists', () => {
        it("deletes account and redirects to root page", async () => {
            findOne.mockImplementationOnce(() => {
                return '1';
            });

            await controller.delete('1', req, res, next);

            expect(authUserSpy).toHaveBeenCalledTimes(1);
            expect(authUserSpy).toHaveBeenLastCalledWith(req);

            expect(findOne).toHaveBeenCalledTimes(1);
            expect(findOne).toHaveBeenLastCalledWith('1', {where: [
                {user_id: user.id}
            ]});

            expect(deleteFn).toHaveBeenCalledTimes(1);
            expect(deleteFn).toHaveBeenLastCalledWith('1');

            expect(redirect).toHaveBeenCalledTimes(1);
            expect(redirect).toHaveBeenLastCalledWith('/api-keys');
        });
    });
    describe("when record doesn't exist", () => {
        it("throws 'Not found.' error", async () => {
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
                {user_id: user.id}
            ]});

            expect(error).toMatchObject(new Exception('Not found.', 404));
        });
    });
});