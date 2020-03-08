import confirmed from '../../../validators/confirmed';
import { Request } from 'express';

describe('confirmed', () => {
    describe('when confirmation value does not match', () => {
        it("returns false", async () => {
            let req = {
                body: {
                    rnd_confirmation: undefined
                }
            } as Request;

            expect(confirmed(req, 'rnd', 'test')).toBe(false);

            req.body['rnd_confirmation'] = 'testing';

            expect(confirmed(req, 'rnd', 'test')).toBe(false);

            req.body['rnd_confirmation'] = 2;

            expect(confirmed(req, 'rnd', 1)).toBe(false);

            req.body['rnd_confirmation'] = true;

            expect(confirmed(req, 'rnd', false)).toBe(false);

            req.body['rnd_confirmation'] = {a: 1};

            expect(confirmed(req, 'rnd', {a: 1, b: 2})).toBe(false);

            req.body['rnd_confirmation'] = [1, 2];

            expect(confirmed(req, 'rnd', [3])).toBe(false);
        });
    });
    describe('when confirmation value does match', () => {
        it("returns true", async () => {
            let req = {
                body: {
                    rnd_confirmation: 'test'
                }
            } as Request;

            expect(confirmed(req, 'rnd', 'test')).toBe(true);

            req.body['rnd_confirmation'] = 1;

            expect(confirmed(req, 'rnd', 1)).toBe(true);

            req.body['rnd_confirmation'] = true;

            expect(confirmed(req, 'rnd', true)).toBe(true);

            req.body['rnd_confirmation'] = {a: 1};

            expect(confirmed(req, 'rnd', {a: 1})).toBe(true);

            req.body['rnd_confirmation'] = [1, 2];

            expect(confirmed(req, 'rnd', [1, 2])).toBe(true);
        });
    });
});