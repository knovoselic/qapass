import AccountListTransformer from '../../../transformers/AccountListTransformer';

describe('Transformer.transformArray', () => {
    describe("when argument is non empty array it calls Transformer.transform for each array element and", () => {
        it("returns array of any elements", () => {
            const transformer =  new AccountListTransformer;

            const transformSpy = jest.spyOn(transformer, 'transform');

            transformSpy.mockImplementation((item) => item);

            expect(transformer.transformArray([1, 2])).toMatchObject([1, 2]);
            expect(transformSpy).toHaveBeenCalledTimes(2);
            expect(transformSpy).toHaveBeenNthCalledWith(1, 1)
            expect(transformSpy).toHaveBeenNthCalledWith(2, 2);
        });
    });
});