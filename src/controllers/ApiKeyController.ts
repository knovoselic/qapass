import { Request, Response, NextFunction } from 'express';
import { interfaces, controller, httpGet, request, response, next, httpDelete, httpPost, requestParam } from 'inversify-express-utils';
import BaseController from './BaseController';
import authenticated from '../middlewares/authenticated';
import { Repository } from 'typeorm';
import ApiKey from '../entity/ApiKey';
import { inject } from 'inversify';
import { auth_user } from '../helpers';
import Exception from '../errors/Exception';
import ApiKeyListTransformer from '../transformers/ApiKeyListTransformer';

@controller('/api-keys')
class ApiKeyController extends BaseController implements interfaces.Controller
{
    protected apiKeyRepository: Repository<ApiKey>;
    protected apiKeyListTransformer: ApiKeyListTransformer;

    constructor(
        @inject('Repository<ApiKey>') apiKeyRepository: Repository<ApiKey>,
        @inject('ApiKeyListTransformer') apiKeyListTransformer: ApiKeyListTransformer
    ) {
        super();

        this.apiKeyRepository = apiKeyRepository;
        this.apiKeyListTransformer = apiKeyListTransformer;
    }

    @httpGet('/', authenticated)
    public async index(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        let api_keys = await this.apiKeyRepository.find({where: [
            {user_id: user.id},
        ]});

        let generated = req.flash('generated')[0];

        if(generated) generated = JSON.parse(generated);

        api_keys = this.apiKeyListTransformer.transformArray(api_keys);

        return this.render(res, 'api-keys/index', {
            api_keys: api_keys,
            csrf: req.csrfToken(),
            generated: generated
        });
    }

    @httpPost('/generate', authenticated)
    public async generate(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        let api_key = null;

        try {
            api_key = await this.apiKeyRepository.save({
                user_id: user.id,
                key: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                secret: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            });
        } catch (error) {
            throw new Exception('Internal error.', 500);
        }

        req.flash('generated', JSON.stringify(api_key));

        return res.redirect('/api-keys');
    }

    @httpDelete('/:id/delete', authenticated)
    public async delete(@requestParam('id') id: string, @request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        const api_key = await this.apiKeyRepository.findOne(id, {where: [
            {user_id: user.id},
        ]});

        if(!api_key) throw new Exception('Not found.', 404);

        await this.apiKeyRepository.delete(api_key);

        return res.redirect('/api-keys');
    }
}

export default ApiKeyController;