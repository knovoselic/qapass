import loginRequest from '../../../requests/LoginRequest';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import Exception from '../../../errors/Exception';

describe('Request.validate', () => {
    describe("collects rules with Request.rules, maps errors with Request.map and", () => {
        it("calls Request.fail if there are validation errors", async () => {
            const request = loginRequest as any;

            const failSpy = jest.spyOn(request, 'fail');

            failSpy.mockImplementation((...args) => {
                return 'failed';
            });

            const req = {
                body: {}
            } as Request;

            const res = {} as Response;

            const next = jest.fn() as NextFunction;

            await loginRequest.validate(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(failSpy).toHaveBeenCalledTimes(1);
            expect(failSpy).toHaveBeenCalledWith(expect.anything(), req, res, next);
        });

        it("calls next if there no validation errors", async () => {
            const request = loginRequest as any;

            const mapErrorsSpy = jest.spyOn(request, 'mapErrors');

            mapErrorsSpy.mockImplementation((...args) => {
                return {};
            });

            const req = {
                body: {}
            } as Request;

            const res = {} as Response;

            const next = jest.fn() as NextFunction;

            await loginRequest.validate(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });
        it("calls next if there is internal error", async () => {
            const request = loginRequest as any;

            const mapErrorsSpy = jest.spyOn(request, 'mapErrors');

            mapErrorsSpy.mockImplementation((...args) => {
                return {};
            });

            const req = {
            } as Request;

            const res = {} as Response;

            const next = jest.fn() as NextFunction;

            await loginRequest.validate(req, res, next);

            expect(next).toHaveBeenCalledTimes(2);
            expect(next).toHaveBeenCalledWith(expect.anything());
        });
    });
});

describe('Request.getMessages', () => {
    describe("when called with identifier that exists in dictionary", () => {
        it("returns the value in dictionary", () => {
            const request = loginRequest as any;

            expect(request.getMessage('required')).toBe('Value is required.');
        });
    });
    describe("when called with identifier that does not exist in dictionary", () => {
        it("returns with default message", () => {
            const request = loginRequest as any;

            expect(request.getMessage('any')).toBe('Invalid value.');
        });
    });
});

describe('Request.fail', () => {
    describe("when xhr request and/or 'accept: application/json' header present", () => {
        it("calls next function", () => {
            const request = loginRequest as any;

            const req = {
                xhr: true,
                headers: {
                    accept: 'application/json'
                } as IncomingHttpHeaders
            } as Request;

            const res = {} as Response;

            const next = jest.fn() as NextFunction;

            const errors = {
                email: [
                    'error'
                ]
            };

            request.fail(errors, req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenLastCalledWith(new Exception('Invalid request payload.', 422, errors));
        });
    });
    describe("when not xhr request and 'accept: application/json' header is not present", () => {
        it("sets errors to flash bag and redirect to referer or root site", () => {
            const request = loginRequest as any;

            const flash = jest.fn();
            let header = jest.fn(() => '/login');

            let req = {
                flash: flash as Function,
                header: header as Function,
                xhr: false,
                headers: {
                } as IncomingHttpHeaders
            } as Request;

            const redirect = jest.fn();

            const res = {
                redirect: redirect as Function
            } as Response;

            const next = jest.fn() as NextFunction;

            const errors = {
                email: [
                    'error'
                ]
            };

            request.fail(errors, req, res, next);

            expect(flash).toHaveBeenCalledTimes(1);
            expect(flash).toHaveBeenLastCalledWith('validation-errors', errors);
            expect(header).toHaveBeenCalledTimes(1);
            expect(header).toHaveBeenLastCalledWith('Referer');
            expect(redirect).toHaveBeenCalledTimes(1);
            expect(redirect).toHaveBeenLastCalledWith('/login');

            header = jest.fn(() => '');

            req = {
                flash: flash as Function,
                header: header as Function,
                xhr: false,
                headers: {
                } as IncomingHttpHeaders
            } as Request;

            request.fail(errors, req, res, next);

            expect(flash).toHaveBeenCalledTimes(2);
            expect(flash).toHaveBeenLastCalledWith('validation-errors', errors);
            expect(header).toHaveBeenCalledTimes(1);
            expect(header).toHaveBeenLastCalledWith('Referer');
            expect(redirect).toHaveBeenCalledTimes(2);
            expect(redirect).toHaveBeenLastCalledWith('/');
        });
    });
});

describe('Request.valueSet', () => {
    describe("when value is undefined/null/false/''", () => {
        it("returns false", () => {
            const request = loginRequest as any;

            expect(request.valueSet(undefined)).toBe(false);
            expect(request.valueSet(null)).toBe(false);
            expect(request.valueSet(false)).toBe(false);
            expect(request.valueSet('')).toBe(false);
        });
    });
    describe("when value is not undefined/null/false/''", () => {
        it("returns true", () => {
            const request = loginRequest as any;

            expect(request.valueSet({})).toBe(true);
            expect(request.valueSet(true)).toBe(true);
            expect(request.valueSet([])).toBe(true);
            expect(request.valueSet('asdsadsad')).toBe(true);
            expect(request.valueSet(1)).toBe(true);
        });
    });
});

describe('Request.parseRule', () => {
    describe("when rule string doesn't contain ':' characters", () => {
        it("returns object without defined data property", () => {
            const request = loginRequest as any;

            expect(request.parseRule('test')).toMatchObject({
                rule: 'test',
                data: undefined
            });
        });
    });
    describe("when rule string contains ':' characters", () => {
        it("returns object with defined data property", () => {
            const request = loginRequest as any;

            expect(request.parseRule('test:param')).toMatchObject({
                rule: 'test',
                data: 'param'
            });
            expect(request.parseRule('test:param:param')).toMatchObject({
                rule: 'test',
                data: 'param:param'
            });
        });
    });
});

describe('Request.mapErrors', () => {
    it("adds field errors to errors object", () => {
        const request = loginRequest as any;

        const errors = {
            password: {
                required: 'required',
                string: 'string',
            },
            email: {}
        };

        const field_errors = {
            email: {
                required: 'required',
                string: 'string',
            }
        }

        request.mapErrors(errors, field_errors);

        expect(errors).toMatchObject({
            password: {
                required: 'required',
                string: 'string',
            },
            email: {
                required: 'required',
                string: 'string',
            }
        })
    });
});