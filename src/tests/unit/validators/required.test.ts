import required from '../../../validators/required';
import { Request } from 'express';

const req = {} as Request;

describe('required', () => {
    describe('when subject value is undefined, null, false, or empty string', () => {
        it("returns false", async () => {
            expect(required(req, 'rnd', null)).toBe(false);
            expect(required(req, 'rnd', undefined)).toBe(false);
            expect(required(req, 'rnd', false)).toBe(false);
            expect(required(req, 'rnd', '')).toBe(false);
        });
    });
    describe('when subject value is not undefined, null, false, or empty string', () => {
        it("returns true", async () => {
            expect(required(req, 'rnd', '1')).toBe(true);
            expect(required(req, 'rnd', [])).toBe(true);
            expect(required(req, 'rnd', {})).toBe(true);
            expect(required(req, 'rnd', true)).toBe(true);
        });
    });
});