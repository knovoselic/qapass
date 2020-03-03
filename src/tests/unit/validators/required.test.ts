import required from '../../../validators/required';

describe('required', () => {
    it("returns false if value is undefined, null, false, or empty string", async () => {
        expect(required(null)).toBe(false);
        expect(required(undefined)).toBe(false);
        expect(required(false)).toBe(false);
        expect(required('')).toBe(false);
    });
    it("returns true if value is not undefined, null, false, or empty string", async () => {
        expect(required('1')).toBe(true);
        expect(required([])).toBe(true);
        expect(required({})).toBe(true);
        expect(required(true)).toBe(true);
    });
});