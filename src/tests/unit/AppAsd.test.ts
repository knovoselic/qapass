import app from '../../App';
import { getRepository } from 'typeorm';
import User from '../../entity/User';
import Account from '../../entity/Account';
import ApiKey from '../../entity/ApiKey';
import { Application } from 'express';
import agent from 'supertest';

describe('App.getApplication', () => {
    it('returns a singleton e.Application instance', async () => {
        const buildSpy = jest.spyOn(<any> app, 'build');

        const app1 = await app.getApplication();

        expect(buildSpy).toHaveBeenCalledTimes(1);
        expect(typeof app1 == 'function').toBe(true);

        const app2 = await app.getApplication();

        expect(buildSpy).toHaveBeenCalledTimes(1);
        expect(typeof app2 == 'function').toBe(true);
    });
});

describe('App.run', () => {
    it('runs http server', async () => {
        const getApplicationSpy = jest.spyOn(<any> app, 'getApplication');

        getApplicationSpy.mockImplementationOnce(() => undefined);

        const setTimeout = jest.fn();

        const listen = jest.fn(() => {
            return {
                setTimeout: setTimeout as Function
            };
        });

        (<any>app).application = {
            listen: listen as Function
        } as Application;

        await app.run(3000);

        expect(getApplicationSpy).toHaveBeenCalledTimes(1);
        expect(listen).toHaveBeenCalledTimes(1);
        expect(listen).toHaveBeenLastCalledWith(3000);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(10000);

        (<any>app).application = undefined;
    });
});