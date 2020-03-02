import max from '../../../validators/max';

describe('Function max should', () => {
    it("return true for subject of null or undefined values", () => {
        expect(max(null, '1')).toBe(true);
        expect(max(undefined, '1')).toBe(true);
    });
    it("throw error if second argument is not a string containing integer or (string/number/array),integer", () => {
        expect(() => max('4', '')).toThrowError('Invalid max rule definition.');
        expect(() => max('4', 'xyz,1')).toThrowError('Invalid max rule definition.');
        expect(() => max('4', 'xyz,1')).toThrowError('Invalid max rule definition.');
        expect(() => max('4', 'number,xyz')).toThrowError('Non integer value for limit encountered.');
    });
    it("evaluate subject as a string if no defined type and return true for subject with length lesser or equal to limit", () => {
        expect(max('2', '1')).toBe(true);
        expect(max('asd', '5')).toBe(true);
    });
    it("evaluate subject as a string if no defined type and return false for subject with length greater than limit", () => {
        expect(max('22', '1')).toBe(false);
        expect(max('asdasd', '5')).toBe(false);
    });
    it("evaluate subject with defined type and return true for subject evaluation complying with limit", () => {
        expect(max('2', 'number,3')).toBe(true);
        expect(max('2.5', 'number,3')).toBe(true);
        expect(max('test', 'string,4')).toBe(true);
        expect(max('test', 'string,5')).toBe(true);
        expect(max(['asdasd', 1], 'array,3')).toBe(true);
    });
    it("evaluate subject defined type and return false for subject evaluation not complying to limit", () => {
        expect(max('2', 'number,1')).toBe(false);
        expect(max('1.1', 'number,1')).toBe(false);
        expect(max('a', 'number,1')).toBe(false);
        expect(max('test', 'string,2')).toBe(false);
        expect(max('test', 'array,1')).toBe(false);
    });
    // it("return true for string subject with numeric value being less than or equal to limit", () => {
    //     expect(max('1', '2')).toBe(true);
    //     expect(max('2', '2')).toBe(true);
    //     expect(max('1.1', '2')).toBe(true);
    // });
    // it("return false for string subject with non numeric value having length greater than limit", () => {
    //     expect(max('hello', '2')).toBe(false);
    // });
    // it("return true for string subject with non numeric value having length lesser or equal to limit", () => {
    //     expect(max('hi', '5')).toBe(true);
    //     expect(max('hello', '5')).toBe(true);
    // });
    // it("return false for array subject with length greater than limit", () => {
    //     expect(max([1,2], '1')).toBe(false);
    // });
    // it("return true for array subject being greater than limit", () => {
    //     expect(max([1], '2')).toBe(true);
    //     expect(max([1, 2], '2')).toBe(true);
    // });
    // it("return false for number subject being greater than limit", () => {
    //     expect(max(2, '1')).toBe(false);
    //     expect(max(1.1, '1')).toBe(false);
    // });
    // it("return true for number subject being lesser or equal to limit", () => {
    //     expect(max(2, '2')).toBe(true);
    //     expect(max(1, '2')).toBe(true);
    //     expect(max(1.1, '2')).toBe(true);
    // });
    // it("throw error if first argument is not of string/array/number type", () => {
    //     expect(() => max({}, '1')).toThrowError('Not implemented.');
    //     expect(() => max(true, '1')).toThrowError('Not implemented.');
    // });
});