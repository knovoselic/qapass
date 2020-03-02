import { accepts_json, knex, user, auth_user } from '../../helpers';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import knexConnection  from "knex";
import User from '../../entity/User';
import { Connection } from 'typeorm';
import { Container } from 'inversify';

describe('Function accepts_json should', () => {
    it("return true for accept application/json header", async () => {
        const req = {
            xhr: false,
            headers: {
                accept: 'application/json'
            } as IncomingHttpHeaders
        } as Request;

        expect(accepts_json(req)).toBe(true);
    });
    it("return true for xhr request", async () => {
        const req = {
            xhr: true,
            headers: {
                accept: 'random'
            } as IncomingHttpHeaders
        } as Request;

        expect(accepts_json(req)).toBe(true);
    });
    it("returns true if both application/json header and xhr request", async () => {
        const req = {
            xhr: true,
            headers: {
                accept: 'application/json'
            } as IncomingHttpHeaders
        } as Request;

        expect(accepts_json(req)).toBe(true);
    });
    it("returns false if no application/json header or xhr request", async () => {
        const req = {
            xhr: false,
            headers: {
                accept: 'random'
            } as IncomingHttpHeaders
        } as Request;

        expect(accepts_json(req)).toBe(false);
    });
});

describe('Function knex should', () => {
    it("return knex connection", async () => {
        const container = global.container as Container;

        const knex_connection = container.get<knexConnection>('knex');

        expect(knex()).toEqual(knex_connection);
    });
});

describe('Function user should', () => {
    it("return undefined for empty req.user value", async () => {
        const req = {
        } as Request;

        expect(await user(req)).toBe(undefined);
    });
    it("return undefined for non exitant req.user value", async () => {
        const req = {
            user: 1 as Express.User
        } as Request;

        expect(await user(req)).toEqual(undefined);
    });
    it("return User for exitant req.user value", async () => {
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

describe('Function auth_user should', () => {
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