import max from '../../../validators/max';
import { Request } from 'express';

const req = {} as Request;

describe('max', () => {
    it("throws error if second argument is not a string containing integer or '[type],integer' string value", () => {
        expect(() => max(req, 'rnd', '4', '')).toThrowError('Invalid max rule definition.');
        expect(() => max(req, 'rnd', '4', 'xyz,1')).toThrowError('Invalid max rule definition.');
        expect(() => max(req, 'rnd', '4', 'xyz,1')).toThrowError('Invalid max rule definition.');
        expect(() => max(req, 'rnd', '4', 'number,xyz')).toThrowError('Non integer value for limit encountered.');
    });
    describe('returns false for subject with', () => {
        it("undefined rule type that is non-compliant to limit", () => {
            expect(max(req, 'rnd', '22', '1')).toBe(false);
            expect(max(req, 'rnd', 'asdasd', '5')).toBe(false);
        });
        it("valid rule type that in non-compliant to limit", () => {
            expect(max(req, 'rnd', '2', 'number,1')).toBe(false);
            expect(max(req, 'rnd', '1.1', 'number,1')).toBe(false);
            expect(max(req, 'rnd', 'a', 'number,1')).toBe(false);
            expect(max(req, 'rnd', 'test', 'string,2')).toBe(false);
            expect(max(req, 'rnd', 'test', 'array,1')).toBe(false);
        });
    });
    describe('returns true for subject', () => {
        it("of null or undefined values", () => {
            expect(max(req, 'rnd', null, '1')).toBe(true);
            expect(max(req, 'rnd', undefined, '1')).toBe(true);
        });
        it("with valid rule type that complies to limit", () => {
            expect(max(req, 'rnd', '2', 'number,3')).toBe(true);
            expect(max(req, 'rnd', '2.5', 'number,3')).toBe(true);
            expect(max(req, 'rnd', 'test', 'string,4')).toBe(true);
            expect(max(req, 'rnd', 'test', 'string,5')).toBe(true);
            expect(max(req, 'rnd', ['asdasd', 1], 'array,3')).toBe(true);
        });
        it("with no defined rule type that complies to limit", () => {
            expect(max(req, 'rnd', '2', '1')).toBe(true);
            expect(max(req, 'rnd', 'asd', '5')).toBe(true);
        });
    });
});