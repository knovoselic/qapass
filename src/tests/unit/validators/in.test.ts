import inValidator from '../../../validators/in';

describe('in', () => {
    describe('returns false for first argument that is', () => {
        it("not of string type", async () => {
            expect(inValidator({}, '1,2,3')).toBe(false);
        });
        it("not part of csv argument two", async () => {
            expect(inValidator('4', '1,2,3')).toBe(false);
        });
    })
    it("returns true for first argument that is part of csv argument two", async () => {
        expect(inValidator('1', '1,2,3')).toBe(true);
    });
});