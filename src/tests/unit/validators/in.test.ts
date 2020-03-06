import inValidator from '../../../validators/in';
import { Request } from 'express';

const req = {} as Request;

describe('in', () => {
    describe('returns false for first argument that is', () => {
        it("not of string type", async () => {
            expect(inValidator(req, 'rnd', {}, '1,2,3')).toBe(false);
        });
        it("not part of csv argument two", async () => {
            expect(inValidator(req, 'rnd', '4', '1,2,3')).toBe(false);
        });
    })
    it("returns true for first argument that is part of csv argument two", async () => {
        expect(inValidator(req, 'rnd', '1', '1,2,3')).toBe(true);
    });
});