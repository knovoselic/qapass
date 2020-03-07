import { Request, Response, NextFunction } from 'express';
import * as helpers from '../../../helpers';
import User from '../../../entity/User';
import AuthController from '../../../controllers/AuthController';
import Auth from '../../../services/Auth';
import { Container } from 'inversify';

var user: User,
    authUserSpy: jest.SpyInstance,
    validationHelperSpy: jest.SpyInstance,
    controller : AuthController,
    renderSpy: jest.SpyInstance,
    csrf: jest.Mock,
    flash: jest.Mock,
    logout: jest.Mock,
    req: Request,
    redirect: jest.Mock,
    res:  Response,
    next: NextFunction,
    auth: Auth;

beforeEach(async () => {
    authUserSpy = jest.spyOn(helpers, 'auth_user')

    authUserSpy.mockImplementation(() => user);

    validationHelperSpy = jest.spyOn(helpers, 'validation_errors')

    validationHelperSpy.mockImplementation(jest.fn());

    auth = (global.container as Container).get<Auth>('Auth');

    controller = new AuthController(auth);

    renderSpy = jest.spyOn(<any>controller, 'render');

    renderSpy.mockImplementation(jest.fn());

    csrf = jest.fn();
    flash = jest.fn(() => []);
    logout = jest.fn();

    req = {
        csrfToken: csrf as Function,
        flash: flash as Function,
        logout: logout as Function,
        body: {}
    } as Request;

    redirect = jest.fn();

    res = {
        redirect: redirect as Function
    } as Response;

    next = jest.fn() as NextFunction;
});

describe('AuthController.showRegisterForm', () => {
    it("returns rendered page", async () => {
        await controller.showRegisterForm(req, res, next);

        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenLastCalledWith(res, 'register', expect.anything());
    });
});

describe('AuthController.register', () => {
    it("redirects to root page", async () => {
        await controller.register(req, res, next);

        expect(redirect).toHaveBeenCalledTimes(1);
        expect(redirect).toHaveBeenLastCalledWith('/');
    });
});

describe('AuthController.showLoginForm', () => {
    it("returns rendered page", async () => {
        await controller.showLoginForm(req, res, next);

        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenLastCalledWith(res, 'login', expect.anything());
    });
});

describe('AuthController.login', () => {
    it("redirects to root page", async () => {
        await controller.login(req, res, next);

        expect(redirect).toHaveBeenCalledTimes(1);
        expect(redirect).toHaveBeenLastCalledWith('/');
    });
});

describe('AuthController.logout', () => {
    it("logs out user and redirects to /login page", async () => {
        await controller.logout(req, res, next);

        expect(logout).toHaveBeenCalledTimes(1);

        expect(redirect).toHaveBeenCalledTimes(1);
        expect(redirect).toHaveBeenLastCalledWith('/login');
    });
});