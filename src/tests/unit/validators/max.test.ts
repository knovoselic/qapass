import max from '../../../validators/max';

describe('max', () => {
    it("throws error if second argument is not a string containing integer or '[type],integer' string value", () => {
        expect(() => max('4', '')).toThrowError('Invalid max rule definition.');
        expect(() => max('4', 'xyz,1')).toThrowError('Invalid max rule definition.');
        expect(() => max('4', 'xyz,1')).toThrowError('Invalid max rule definition.');
        expect(() => max('4', 'number,xyz')).toThrowError('Non integer value for limit encountered.');
    });
    describe('returns false for subject with', () => {
        it("undefined rule type that is non-compliant to limit", () => {
            expect(max('22', '1')).toBe(false);
            expect(max('asdasd', '5')).toBe(false);
        });
        it("valid rule type that in non-compliant to limit", () => {
            expect(max('2', 'number,1')).toBe(false);
            expect(max('1.1', 'number,1')).toBe(false);
            expect(max('a', 'number,1')).toBe(false);
            expect(max('test', 'string,2')).toBe(false);
            expect(max('test', 'array,1')).toBe(false);
        });
    });
    describe('returns true for subject', () => {
        it("of null or undefined values", () => {
            expect(max(null, '1')).toBe(true);
            expect(max(undefined, '1')).toBe(true);
        });
        it("with valid rule type that complies to limit", () => {
            expect(max('2', 'number,3')).toBe(true);
            expect(max('2.5', 'number,3')).toBe(true);
            expect(max('test', 'string,4')).toBe(true);
            expect(max('test', 'string,5')).toBe(true);
            expect(max(['asdasd', 1], 'array,3')).toBe(true);
        });
        it("with no defined rule type that complies to limit", () => {
            expect(max('2', '1')).toBe(true);
            expect(max('asd', '5')).toBe(true);
        });
    });
});