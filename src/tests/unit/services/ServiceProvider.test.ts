import ServiceProvider from '../../../services/ServiceProvider';

describe('ServiceProvider.get', () => {
    it("returns singleton", async () => {
        expect(await ServiceProvider.get()).toEqual((<any> global).sp);
    });
});