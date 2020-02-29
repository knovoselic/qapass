import required from '../../../validators/required';

describe('Function required should', () => {
    it("return false if value is undefined, null, false, or empty string", async () => {
        expect(required(null)).toBe(false);
        expect(required(undefined)).toBe(false);
        expect(required(false)).toBe(false);
        expect(required('')).toBe(false);
    });
    it("return true if value is not undefined, null, false, or empty string", async () => {
        expect(required('1')).toBe(true);
        expect(required([])).toBe(true);
        expect(required({})).toBe(true);
        expect(required(true)).toBe(true);
    });
});