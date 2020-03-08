import string from '../../../validators/string';
import { Request } from 'express';

const req = {} as Request;

describe('string', () => {
    describe('when subject is not of string type', () => {
        it("returns false", async () => {
            expect(string(req, 'rnd', 1)).toBe(false);
        });
    });
    describe('is of string type', () => {
        it("returns true", async () => {
            expect(string(req, 'rnd', 'test')).toBe(true);
        });
    });
});