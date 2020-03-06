import app from '../../App';
import { Container } from 'inversify';
import { Connection } from 'typeorm';
import User from '../../entity/User';
import agent from 'supertest';

describe("AuthController.register", () => {
    it("returns page when user not logged in", async () => {
        const application = await app.getApplication();

        const result = await agent(application).get("/register");

        expect(result.status).toEqual(200);
    });
    // it("redirects to root page when user is logged in", async () => {
    //     const container = global.container as Container;

    //     const typeorm = container.get<Connection>('typeorm');

    //     const usr = await typeorm.getRepository(User).save({
    //         email: 'test@test.com',
    //         password: '123123'
    //     });
    //     const application = await app.getApplication();

    //     let request = agent(application);

    //     const result = await request.get("/register");

    //     expect(result.status).toEqual(301);
    // });
  });