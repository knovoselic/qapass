import string from '../../../validators/string';

describe('string', () => {
    it("returns false for argument that is not of string type", async () => {
        expect(string(1)).toBe(false);
    });
    it("returns true for argument of string type", async () => {
        expect(string('test')).toBe(true);
    });
});