import * as helpers from '../../helpers';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import User from '../../entity/User';
import { Container } from 'inversify';
import { runInTransaction } from 'typeorm-test-transactions';

describe('accepts_json', () => {
    describe('when xhr request', () => {
        it("returns true", async () => {
            const req = {
                xhr: true,
                headers: {
                    accept: 'random'
                } as IncomingHttpHeaders
            } as Request;

            expect(helpers.accepts_json(req)).toBe(true);
        });
    });
    describe("when xhr request with 'accept application/json' header", () => {
        it("returns true", async () => {
            const req = {
                xhr: true,
                headers: {
                    accept: 'application/json'
                } as IncomingHttpHeaders
            } as Request;

            expect(helpers.accepts_json(req)).toBe(true);
        });
    });
    describe("when non xhr request without 'accept application/json' header", () => {
        it("returns false", async () => {
            const req = {
                xhr: false,
                headers: {
                    accept: 'random'
                } as IncomingHttpHeaders
            } as Request;

            expect(helpers.accepts_json(req)).toBe(false);
        });
    });
});

describe('user', () => {
    describe("when req.user is undefined or doesn't exist", () => {
        it("returns undefined", async () => {
            expect(await helpers.user({} as Request)).toBe(undefined);

            const req = {
                user: 1 as Express.User
            } as Request;

            expect(await helpers.user(req)).toEqual(undefined);
        });
    });
    describe('when req.user value does exist in database', () => {
        it("returns that User instance", runInTransaction(async () => {
            const u = await helpers.typeorm().getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const req = {
                user: u.id as Express.User
            } as Request;

            const record = await helpers.user(req);

            expect(record?.id == u.id).toEqual(true);
        }));
    });
});

describe('auth_user', () => {
    describe("when req.user is undefined or doesn't exist", () => {
        it("throws Internal server error", async () => {
            await expect(helpers.auth_user({} as Request)).rejects.toThrowError('Internal server error.');

            const req = {
                user: 1 as Express.User
            } as Request;

            await expect(helpers.auth_user(req)).rejects.toThrowError('Internal server error.');
        });
    });
    describe('when req.user value does exist in database', () => {
        it("returns that User instance", runInTransaction(async () => {
            const u = await helpers.typeorm().getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const req = {
                user: u.id as Express.User
            } as Request;

            const record = await helpers.auth_user(req);

            expect(record?.id == u.id).toEqual(true);
        }));
    });
});

describe('getFlash', () => {
    describe("when req.flash('identifier') returns undefined", () => {
        it("returns undefined", () => {
            const flash = jest.fn(() => undefined);

            const req = {
                flash: flash as Function
            } as Request;

            expect(helpers.getFlash(req, 'any')).toBe(undefined);
        });
    });
    describe("when req.flash('identifier') returns non array and non undefined value", () => {
        it("returns that value", () => {
            const r = 'test';

            const flash = jest.fn(() => r);

            const req = {
                flash: flash as Function
            } as Request;

            expect(helpers.getFlash(req, 'any')).toBe(r);
        });
    });
    describe("when req.flash('identifier') returns empty array", () => {
        it("returns undefined", () => {
            const flash = jest.fn(() => []);

            const req = {
                flash: flash as Function
            } as Request;

            expect(helpers.getFlash(req, 'any')).toBe(undefined);
        });
    });
    describe("when req.flash('identifier') returns non empty array", () => {
        it("returns first array element", () => {
            const flash = jest.fn(() => [1, 2]);

            const req = {
                flash: flash as Function
            } as Request;

            expect(helpers.getFlash(req, 'any')).toBe(1);
        });
    });
});

describe('validation_errors', () => {
    describe("calls getFlash helper function with 'validation-errors' identifier and", () => {
        it("returns getFlash result", async () => {
            const getFlashSpy = jest.spyOn(helpers, 'getFlash')

            const r = 'return';

            getFlashSpy.mockReturnValue(r);

            const req = {} as Request;

            expect(helpers.validation_errors(req)).toBe(r);
            expect(getFlashSpy).toHaveBeenCalledTimes(1);
            expect(getFlashSpy).toHaveBeenCalledWith(req, 'validation-errors');
        });
    });
});