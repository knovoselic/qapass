import { date_to_string, accepts_json, knex, user, auth_user } from '../../helpers';
import { Request, Express } from 'express';
import { IncomingHttpHeaders } from 'http';
import ServiceProvider from '../../services/ServiceProvider';
import knexConnection  from "knex";
import User from '../../entity/User';
import { Connection } from 'typeorm';

describe('Function date_to_string should', () => {
    it("return YYYY-MM-DD HH:ii:ss format", async () => {
        const date = new Date(2020, 1, 2, 2, 2, 2);

        expect(date_to_string(date)).toEqual('2020-02-02 02:02:02');
    });
});

describe('Function accepts_json should', () => {
    it("return true for accept application/json header", async () => {
        const req = {
            xhr: false,
            headers: {
                accept: 'application/json'
            } as IncomingHttpHeaders
        } as Request;

        expect(accepts_json(req)).toEqual(true);
    });
    it("return true for xhr request", async () => {
        const req = {
            xhr: true,
            headers: {
                accept: 'random'
            } as IncomingHttpHeaders
        } as Request;

        expect(accepts_json(req)).toEqual(true);
    });
    it("returns true if both application/json header and xhr request", async () => {
        const req = {
            xhr: true,
            headers: {
                accept: 'application/json'
            } as IncomingHttpHeaders
        } as Request;

        expect(accepts_json(req)).toEqual(true);
    });
    it("returns false if no application/json header or xhr request", async () => {
        const req = {
            xhr: false,
            headers: {
                accept: 'random'
            } as IncomingHttpHeaders
        } as Request;

        expect(accepts_json(req)).toEqual(false);
    });
});

describe('Function knex should', () => {
    it("return knex connection", async () => {
        const sp = await ServiceProvider.get();

        const container = sp.getContainer();

        const knex_connection = container.get<knexConnection>('knex');

        global.container = container;

        expect(knex()).toEqual(knex_connection);
    });
});

describe('Function user should', () => {
    beforeAll(async () => {
        const sp = await ServiceProvider.get();

        const container = sp.getContainer();

        const knex_connection = container.get<knexConnection>('knex');

        return await knex_connection.table('users').delete();
    });
    it("return undefined for empty req.user value", async () => {
        const req = {
        } as Request;

        expect(await user(req)).toEqual(undefined);
    });
    it("return undefined for non exitant req.user value", async () => {
        const req = {
            user: 1 as Express.User
        } as Request;

        expect(await user(req)).toEqual(undefined);
    });
    it("return User for exitant req.user value", async () => {
        const sp = await ServiceProvider.get();

        const container = sp.getContainer();

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

describe('Function auth_user should', () => {
    beforeAll(async () => {
        const sp = await ServiceProvider.get();

        const container = sp.getContainer();

        const knex_connection = container.get<knexConnection>('knex');

        return await knex_connection.table('users').delete();
    });
    it("throw error for empty req.user value", async () => {
        const req = {
        } as Request;

        await expect(auth_user(req)).rejects.toThrowError('Internal server error.');
    });
    it("throw error for non exitant req.user value", async () => {
        const req = {
            user: 1 as Express.User
        } as Request;

        await expect(auth_user(req)).rejects.toThrowError('Internal server error.');
    });
    it("return User for exitant req.user value", async () => {
        const sp = await ServiceProvider.get();

        const container = sp.getContainer();

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