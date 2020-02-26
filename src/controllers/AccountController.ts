import { Request, Response, NextFunction } from 'express';
import { interfaces, controller, httpGet, request, response, next, httpPut, httpPost, httpDelete, requestParam } from 'inversify-express-utils';
import BaseController from './BaseController';
import { authenticated } from '../middlewares/authenticated';
import { Connection, Repository } from 'typeorm';
import Account from '../entity/Account';
import { inject } from 'inversify';
import { auth_user, validation_errors } from '../helpers';
import Exception from '../errors/Exception';
import upsertAccountRequest from '../requests/UpsertAccountRequest';

@controller('')
class AccountController extends BaseController implements interfaces.Controller
{
    protected typeorm: Connection;
    protected account: Account;
    protected accountRepository: Repository<Account>;

    constructor(
        @inject('Account') account: Account,
        @inject('typeorm') typeorm: Connection
    ) {
        super();

        this.typeorm = typeorm;
        this.account = account;
        this.accountRepository = typeorm.getRepository(Account);
    }

    @httpGet('/', authenticated)
    public async index(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        if(!user) throw new Exception('Internal server error.');

        const accounts = await this.accountRepository.find({where: [
            {user_id: user.id},
            {public: true},
        ]});

        return this.render(res, 'account-manager/index', {
            accounts: accounts,
            csrf: req.csrfToken(),
            errors: validation_errors(req)
        });
    }

    @httpGet('/create', authenticated)
    public async create(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'account-manager/create', {
            csrf: req.csrfToken(),
        });
    }

    @httpPost('/create', authenticated, upsertAccountRequest)
    public async store(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        if(!user) throw new Exception('Internal server error.');

        try {
            await this.accountRepository.save({
                user_id: user.id,
                username: req.body.username,
                password: req.body.account_password,
                host: req.body.host,
                description: req.body.description,
                public: req.body.public,
            });
        } catch (error) {
            throw new Exception('Internal error.', 404);
        }

        return res.redirect('/');
    }

    @httpGet('/:id/edit', authenticated)
    public async edit(@requestParam('id') id: string, @request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        if(!user) throw new Exception('Internal server error.');

        let account = null;

        try {
            account = await this.accountRepository.findOne(id, {where: [
                {user_id: user.id},
                {public: true},
            ]});
        } catch (error) {
            throw new Exception('Not found.', 404);
        }

        return this.render(res, 'account-manager/edit', {
            account: account,
            csrf: req.csrfToken(),
            user: user,
            errors: validation_errors(req)
        });
    }

    @httpPut('/:id/edit', authenticated, upsertAccountRequest)
    public async update(@requestParam('id') id: string, @request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        if(!user) throw new Exception('Internal server error.');

        const account = await this.accountRepository.findOne(id, {where: [
            {user_id: user.id},
            {public: true},
        ]});

        if(!account) throw new Exception('Not found.', 404);

        await this.accountRepository.update(account, {
            user_id: user.id,
            username: req.body.username,
            password: req.body.account_password,
            host: req.body.host,
            description: req.body.description,
            public: req.body.public,
        });

        return res.redirect('/');
    }

    @httpDelete('/:id/delete', authenticated)
    public async delete(@requestParam('id') id: string, @request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        if(!user) throw new Exception('Internal server error.');

        const account = await this.accountRepository.findOne(id, {where: [
            {user_id: user.id},
            {public: true},
        ]});

        if(!account) throw new Exception('Not found.', 404);

        await this.accountRepository.delete(account);

        return res.redirect('/');
    }
}

export default AccountController;