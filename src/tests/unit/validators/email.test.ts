import email from '../../../validators/email';
import { Request } from 'express';

const req = {} as Request;

describe('email', () => {
    describe('returns false', () => {
        it("for non string format", async () => {
            expect(email(req, 'rnd', 1)).toBe(false);
        });
        it("for non valid email format", async () => {
            expect(email(req, 'rnd', 'test')).toBe(false);
            expect(email(req, 'rnd', 'test@test')).toBe(false);
        });
    });
    it("returns true for valid email format", async () => {
        expect(email(req, 'rnd', 'test@test.com')).toBe(true);
    });
});