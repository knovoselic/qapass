import string from '../../../validators/string';

describe('Function string should', () => {
    it("return false for argument that is not of string type", async () => {
        expect(string(1)).toBe(false);
    });
    it("return true for argument of string type", async () => {
        expect(string('test')).toBe(true);
    });
});