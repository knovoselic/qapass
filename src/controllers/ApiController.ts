import { Request, Response, NextFunction } from 'express';
import { interfaces, controller, httpGet, request, response, next } from 'inversify-express-utils';
import BaseController from './BaseController';
import { auth_user } from '../helpers';
import { Connection, getCustomRepository } from 'typeorm';
import { inject } from 'inversify';
import AccountFilter from '../filters/AccountFilter';
import AccountListTransformer from '../transformers/AccountListTransformer';
import AccountRepository from '../repositories/AccountRepository';

@controller('/api')
class ApiController extends BaseController implements interfaces.Controller
{
    protected accountRepository: AccountRepository;
    protected accountFilter: AccountFilter;
    protected typeorm: Connection;
    protected accountListTransformer: AccountListTransformer;

    constructor(
        @inject('AccountFilter') accountFilter: AccountFilter,
        @inject('typeorm') typeorm: Connection,
        @inject('AccountListTransformer') accountListTransformer: AccountListTransformer,
    ) {
        super();

        this.accountRepository = getCustomRepository(AccountRepository);
        this.accountFilter = accountFilter;
        this.typeorm = typeorm;
        this.accountListTransformer = accountListTransformer;
    }

    @httpGet('/passwords')
    public async index(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        const accounts = await this.accountRepository
            .filter(req, this.accountFilter)
            .ownedByUserOrPublic(user.id);

        return res.status(200)
            .json(this.accountListTransformer.transformArray(accounts));
    }
}

export default ApiController;