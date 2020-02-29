import email from '../../../validators/email';

describe('Function email should', () => {
    it("return false for non string format", async () => {
        expect(email(1)).toBe(false);
    });
    it("return false for non valid email format", async () => {
        expect(email('test')).toBe(false);
        expect(email('test@test')).toBe(false);
    });
    it("return false for valid email format", async () => {
        expect(email('test@test.com')).toBe(true);
    });
});