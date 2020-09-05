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
    describe('when subject is an email ending with @cOdEcoNs.com', () => {
        it("returns true", async () => {
            expect(email(req, 'rnd', 'test@cOdEcoNs.com')).toBe(true);
        });
    });
    describe('when subject is an email ending with @codecons.com', () => {
        it("returns true", async () => {
            expect(email(req, 'rnd', 'test@codecons.com')).toBe(true);
        });
    });
    describe('when subject is an email ending with @glooko.com', () => {
        it("returns true", async () => {
            expect(email(req, 'rnd', 'test@glooko.com')).toBe(true);
        });
    });
    describe('when subject is an email ending with @gmail.com', () => {
        it("returns false", async () => {
            expect(email(req, 'rnd', 'test@gmail.com')).toBe(false);
        });
    });
    describe('when subject is an email ending with @test.com', () => {
        it("returns false", async () => {
            expect(email(req, 'rnd', 'test@test.com')).toBe(false);
        });
    });
});
