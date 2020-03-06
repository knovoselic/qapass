import required from '../../../validators/required';
import { Request } from 'express';

const req = {} as Request;

describe('required', () => {
    it("returns false if value is undefined, null, false, or empty string", async () => {
        expect(required(req, 'rnd', null)).toBe(false);
        expect(required(req, 'rnd', undefined)).toBe(false);
        expect(required(req, 'rnd', false)).toBe(false);
        expect(required(req, 'rnd', '')).toBe(false);
    });
    it("returns true if value is not undefined, null, false, or empty string", async () => {
        expect(required(req, 'rnd', '1')).toBe(true);
        expect(required(req, 'rnd', [])).toBe(true);
        expect(required(req, 'rnd', {})).toBe(true);
        expect(required(req, 'rnd', true)).toBe(true);
    });
});