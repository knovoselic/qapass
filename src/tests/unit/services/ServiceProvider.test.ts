import ServiceProvider from '../../../services/ServiceProvider';

describe('ServiceProvider instance', () => {
    it("get method should return singleton", async () => {
        const sp = await ServiceProvider.get();

        expect(await ServiceProvider.get()).toEqual(sp);
    });
});