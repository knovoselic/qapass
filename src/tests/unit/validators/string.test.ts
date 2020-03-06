import string from '../../../validators/string';
import { Request } from 'express';

const req = {} as Request;

describe('string', () => {
    it("returns false for argument that is not of string type", async () => {
        expect(string(req, 'rnd', 1)).toBe(false);
    });
    it("returns true for argument of string type", async () => {
        expect(string(req, 'rnd', 'test')).toBe(true);
    });
});