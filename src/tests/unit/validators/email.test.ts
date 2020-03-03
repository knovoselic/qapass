import email from '../../../validators/email';

describe('email', () => {
    describe('returns false', () => {
        it("for non string format", async () => {
            expect(email(1)).toBe(false);
        });
        it("for non valid email format", async () => {
            expect(email('test')).toBe(false);
            expect(email('test@test')).toBe(false);
        });
    });
    it("returns true for valid email format", async () => {
        expect(email('test@test.com')).toBe(true);
    });
});