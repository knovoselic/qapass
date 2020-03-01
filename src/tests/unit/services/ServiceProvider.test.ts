import ServiceProvider from '../../../services/ServiceProvider';

describe('ServiceProvider instance', () => {
    it("get method should return singleton", async () => {
        expect(await ServiceProvider.get()).toEqual((<any> global).serviceProvider);
    });
});