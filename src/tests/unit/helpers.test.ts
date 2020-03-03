import { accepts_json, knex, user, auth_user } from '../../helpers';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import knexConnection  from "knex";
import User from '../../entity/User';
import { Connection } from 'typeorm';
import { Container } from 'inversify';

describe('accepts_json', () => {
    describe('when xhr request', () => {
        it("returns true", async () => {
            const req = {
                xhr: true,
                headers: {
                    accept: 'random'
                } as IncomingHttpHeaders
            } as Request;

            expect(accepts_json(req)).toBe(true);
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

            expect(accepts_json(req)).toBe(true);
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

            expect(accepts_json(req)).toBe(false);
        });
    });
});

describe('knex', () => {
    it("returns knex connection", async () => {
        const container = global.container as Container;

        const knex_connection = container.get<knexConnection>('knex');

        expect(knex()).toEqual(knex_connection);
    });
});

describe('user', () => {
    describe("when req.user is undefined or doesn't exist", () => {
        it("returns undefined", async () => {
            expect(await user({} as Request)).toBe(undefined);

            const req = {
                user: 1 as Express.User
            } as Request;

            expect(await user(req)).toEqual(undefined);
        });
    });
    describe('when req.user value does exist in database', () => {
        it("returns that User instance", async () => {
            const container = global.container as Container;

            const typeorm = container.get<Connection>('typeorm');

            const u = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const req = {
                user: u.id as Express.User
            } as Request;

            const record = await user(req);

            expect(record?.id == u.id).toEqual(true);
        });
    });
});

describe('auth_user', () => {
    describe("when req.user is undefined or doesn't exist", () => {
        it("throws Internal server error", async () => {
            await expect(auth_user({} as Request)).rejects.toThrowError('Internal server error.');

            const req = {
                user: 1 as Express.User
            } as Request;

            await expect(auth_user(req)).rejects.toThrowError('Internal server error.');
        });
    });
    describe('when req.user value does exist in database', () => {
        it("returns that User instance", async () => {
            const container = global.container as Container;

            const typeorm = container.get<Connection>('typeorm');

            const u = await typeorm.getRepository(User).save({
                email: 'test@test.com',
                password: '123123'
            });

            const req = {
                user: u.id as Express.User
            } as Request;

            const record = await auth_user(req);

            expect(record?.id == u.id).toEqual(true);
        });
    });
});