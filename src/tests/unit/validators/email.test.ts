import email from '../../../validators/email';
import { Request } from 'express';

const req = {} as Request;

describe('email', () => {
    describe('when subject is of non string format or not a valid email format', () => {
        it("returns false", async () => {
            expect(email(req, 'rnd', 1)).toBe(false);
            expect(email(req, 'rnd', 'test')).toBe(false);
            expect(email(req, 'rnd', 'test@test')).toBe(false);
        });
    });
    describe('when subject is a string of valid email format', () => {
        it("returns true", async () => {
            expect(email(req, 'rnd', 'test@test.com')).toBe(true);
        });
    });
});