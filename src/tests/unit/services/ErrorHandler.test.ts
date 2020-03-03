import Logger from '../../../services/Logger';
import ErrorHandler from '../../../services/ErrorHandler';
import Exception from '../../../errors/Exception';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';

const write = jest.fn();

const logger = {
    write: <Function>write
} as Logger;

const errorHandler = new ErrorHandler(logger);

const json = jest.fn();

const render = jest.fn();

const status = jest.fn((code: number) => {
    return {
        json: json as Function,
        render: render as Function,
    } as Response;
});

const res = {
    status: status as Function,
} as Response;

const next = jest.fn() as NextFunction;

describe('ErrorHandler.handle', () => {
    describe("when called with xhr request and/or request that has 'accept application/json header'", () => {
        it('returns json response', () => {
            const req = {
                xhr: true,
                headers: {
                    accept: 'random'
                } as IncomingHttpHeaders
            } as Request;

            const e = new Exception('Error', 422);

            errorHandler.handle(e, req, res, next);

            const json_param = {
                message: e.message
            };

            expect(status).toHaveBeenCalledTimes(1);
            expect(status).toHaveBeenLastCalledWith(422);
            expect(json).toHaveBeenCalledTimes(1);
            expect(json).toHaveBeenLastCalledWith(json_param);

            req.headers.accept = 'application/json';

            errorHandler.handle(e, req, res, next);

            expect(status).toHaveBeenCalledTimes(2);
            expect(status).toHaveBeenLastCalledWith(422);
            expect(json).toHaveBeenCalledTimes(2);
            expect(json).toHaveBeenLastCalledWith(json_param);

            req.xhr = false;

            errorHandler.handle(e, req, res, next);

            expect(status).toHaveBeenCalledTimes(3);
            expect(status).toHaveBeenLastCalledWith(422);
            expect(json).toHaveBeenCalledTimes(3);
            expect(json).toHaveBeenLastCalledWith(json_param);

            status.mockClear();
            json.mockClear();
        });
    });
    describe("when called with non xhr request that doesn't have 'accept application/json header'", () => {
        it('returns view response', () => {
            const req = {
                xhr: false,
                headers: {
                    accept: 'random'
                } as IncomingHttpHeaders
            } as Request;

            const e = new Exception('Error', 422);

            errorHandler.handle(e, req, res, next);

            expect(status).toHaveBeenCalledTimes(1);
            expect(status).toHaveBeenLastCalledWith(422);
            expect(render).toHaveBeenCalledTimes(1);
            expect(render).toHaveBeenLastCalledWith('error', {
                message: e.message,
                errors: null,
                layout: false
            });

            status.mockClear();
            render.mockClear();
        });
    });
    describe("when error code is greater or equal to 500 or is contained by ErrorHandler.log_codes", () => {
        it('calls logger.write', () => {
            const req = {
                xhr: false,
                headers: {
                    accept: 'random'
                } as IncomingHttpHeaders
            } as Request;

            const date = new Date();

            let error = new Exception('Error');
            let content = `${date}\r\n${req.method} on ${req.path}\r\nError:\r\n${error}\r\n`;

            errorHandler.handle(error, req, res, next);

            expect(write).toHaveBeenCalledTimes(1);
            expect(write).toHaveBeenLastCalledWith(
                content,
                'errors.log'
            );

            error = new Exception('Error', 501);
            content = `${date}\r\n${req.method} on ${req.path}\r\nError:\r\n${error}\r\n`;

            errorHandler.handle(error, req, res, next);

            expect(write).toHaveBeenCalledTimes(2);
            expect(write).toHaveBeenLastCalledWith(
                content,
                'errors.log'
            );

            error = new Exception('Error', 400);
            content = `${date}\r\n${req.method} on ${req.path}\r\nError:\r\n${error}\r\n`;

            errorHandler.handle(error, req, res, next);

            expect(write).toHaveBeenCalledTimes(3);
            expect(write).toHaveBeenLastCalledWith(
                content,
                'errors.log'
            );

            error = new Exception('Error', 408);
            content = `${date}\r\n${req.method} on ${req.path}\r\nError:\r\n${error}\r\n`;

            errorHandler.handle(error, req, res, next);

            expect(write).toHaveBeenCalledTimes(4);
            expect(write).toHaveBeenLastCalledWith(
                content,
                'errors.log'
            );

            write.mockClear();
            status.mockClear();
            render.mockClear();
        });
    });
});