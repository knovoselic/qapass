import inValidator from '../../../validators/in';
import { Request } from 'express';

const req = {} as Request;

describe('in', () => {
    describe('when first argument is not of string type or not part of csv argument two', () => {
        it("returns false", async () => {
            expect(inValidator(req, 'rnd', {}, '1,2,3')).toBe(false);
            expect(inValidator(req, 'rnd', '4', '1,2,3')).toBe(false);
        });
    })
    describe('when first argument is string and is part of csv argument two', () => {
        it("returns true", async () => {
            expect(inValidator(req, 'rnd', '1', '1,2,3')).toBe(true);
        });
    });
});