import max from '../../../validators/max';

describe('Function max should', () => {
    it("return true for subject of null or undefined values", () => {
        expect(max(null, '1')).toBe(true);
        expect(max(undefined, '1')).toBe(true);
    });
    it("throw error if second argument is not a string containing integer", () => {
        expect(() => max('4', 'xyz')).toThrowError('Non integer value for limit encountered.');
    });
    it("return false for string subject with numeric value being larger than limit", () => {
        expect(max('2', '1')).toBe(false);
        expect(max('1.1', '1')).toBe(false);
    });
    it("return true for string subject with numeric value being less than or equal to limit", () => {
        expect(max('1', '2')).toBe(true);
        expect(max('2', '2')).toBe(true);
        expect(max('1.1', '2')).toBe(true);
    });
    it("return false for string subject with non numeric value having length greater than limit", () => {
        expect(max('hello', '2')).toBe(false);
    });
    it("return true for string subject with non numeric value having length lesser or equal to limit", () => {
        expect(max('hi', '5')).toBe(true);
        expect(max('hello', '5')).toBe(true);
    });
    it("return false for array subject with length greater than limit", () => {
        expect(max([1,2], '1')).toBe(false);
    });
    it("return true for array subject being greater than limit", () => {
        expect(max([1], '2')).toBe(true);
        expect(max([1, 2], '2')).toBe(true);
    });
    it("return false for number subject being greater than limit", () => {
        expect(max(2, '1')).toBe(false);
        expect(max(1.1, '1')).toBe(false);
    });
    it("return true for number subject being lesser or equal to limit", () => {
        expect(max(2, '2')).toBe(true);
        expect(max(1, '2')).toBe(true);
        expect(max(1.1, '2')).toBe(true);
    });
    it("throw error if first argument is not of string/array/number type", () => {
        expect(() => max({}, '1')).toThrowError('Not implemented.');
        expect(() => max(true, '1')).toThrowError('Not implemented.');
    });
});