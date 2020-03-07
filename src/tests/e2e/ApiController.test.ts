import app from '../../App';
import { getRepository } from 'typeorm';
import User from '../../entity/User';
import Account from '../../entity/Account';
import ApiKey from '../../entity/ApiKey';
import { Application } from 'express';
import agent from 'supertest';

let user: User;
let application: Application;
const key = 'key';
const secret = 'secret';

beforeEach(async () => {
    application = await app.getApplication();

    const accountRepo = getRepository(Account);

    const userRepo = getRepository(User);

    const apiKeyRepo = getRepository(ApiKey);

    user = await userRepo.save({
        email: 'test1@test.com',
        password: '123123'
    });

    await apiKeyRepo.save({
        user_id: user.id,
        key: key,
        secret: secret
    });

    const usr2 = await userRepo.save({
        email: 'test2@test.com',
        password: '123123'
    });

    await accountRepo.save({
        user_id: user.id,
        username: 'test1',
        password: 'test1',
        host: 'host1',
        description: 'test1',
        public: false,
    });

    await accountRepo.save({
        user_id: usr2.id,
        username: 'test2',
        password: 'test2',
        host: 'host1',
        description: 'test2',
        public: false,
    });

    await accountRepo.save({
        user_id: usr2.id,
        username: 'test3',
        password: 'test3',
        host: 'host1',
        description: 'test3',
        public: true,
    });

    await accountRepo.save({
        user_id: usr2.id,
        username: 'test4',
        password: 'test4',
        host: 'host2',
        description: 'test4',
        public: true,
    });
});

describe('ApiController.get', () => {
    describe("when no authorization token or invalid value", () => {
        it("returns unauthorized response", async () => {
            let response = await agent(application)
                .get('/api/passwords');

            expect(response.status).toBe(401);

            response = await agent(application)
                .get('/api/passwords')
                .set('Authorization', `Bearer asdasddas`);

            expect(response.status).toBe(401);

            response = await agent(application)
                .get('/api/passwords')
                .set('Authorization', `Bearer ${key}:${secret}1`);

            expect(response.status).toBe(401);
        });
    });
    describe("when filtered by host with value host1", () => {
        it("returns three records", async () => {
            const response = await agent(application)
                .get('/api/passwords')
                .set('Authorization', `Bearer ${key}:${secret}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
        });
    });
    describe("when filtered by host with value host1", () => {
        it("returns two records", async () => {
            const response = await agent(application)
                .get('/api/passwords')
                .set('Authorization', `Bearer ${key}:${secret}`)
                .query({host: 'host1'});

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });
});