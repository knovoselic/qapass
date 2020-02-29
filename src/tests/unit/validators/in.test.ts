import inValidator from '../../../validators/in';

describe('Function inValidator should', () => {
    it("return false for first argument that is not of string type", async () => {
        expect(inValidator({}, '1,2,3')).toBe(false);
    });
    it("return false for first argument that is not part of csv argument two", async () => {
        expect(inValidator('4', '1,2,3')).toBe(false);
    });
    it("return true for first argument that is part of csv argument two", async () => {
        expect(inValidator('1', '1,2,3')).toBe(true);
    });
});