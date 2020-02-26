import { Request, Response, NextFunction } from 'express';
import { interfaces, controller, httpGet, request, response, next } from 'inversify-express-utils';
import BaseController from './BaseController';
import { auth_user } from '../helpers';
import { Connection, Repository } from 'typeorm';
import { inject } from 'inversify';
import AccountFilter from '../filters/AccountFilter';
import Account from '../entity/Account';
import AccountListTransformer from '../transformers/AccountListTransformer';

@controller('/api')
class ApiController extends BaseController implements interfaces.Controller
{
    protected accountRepository: Repository<Account>;
    protected accountFilter: AccountFilter;
    protected typeorm: Connection;
    protected accountListTransformer: AccountListTransformer;

    constructor(
        @inject('AccountFilter') accountFilter: AccountFilter,
        @inject('typeorm') typeorm: Connection,
        @inject('AccountListTransformer') accountListTransformer: AccountListTransformer,
    ) {
        super();

        this.accountRepository = typeorm.getRepository(Account);
        this.accountFilter = accountFilter;
        this.typeorm = typeorm;
        this.accountListTransformer = accountListTransformer;
    }

    @httpGet('/passwords')
    public async index(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        let where_options: any = this.accountFilter.whereOptions(req);

        const accounts = await this.accountRepository.find({where: [
            {...where_options, ...{user_id: user.id}},
            {...where_options, ...{public: true}},
        ]});

        return res.status(401)
            .json(this.accountListTransformer.transformArray(accounts));
    }
}

export default ApiController;