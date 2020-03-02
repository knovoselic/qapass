import { Request, Response, NextFunction } from "express";
import { Container } from "inversify";
import ApiKey from "../entity/ApiKey";
import { Connection } from "typeorm";

const unauthorized = (res: Response) => {

    return res.status(401)
        .json({
            message: 'Unauthorized.'
        });
}

export default async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['authorization'];

    if(token === undefined) return unauthorized(res);

    token = token.replace('Bearer ', '');

    const token_fragments = token.split(':', 2);

    if(token_fragments.length !== 2) return unauthorized(res);

    const container: Container = global.container;

    const typeorm: Connection = container.get<Connection>('typeorm');

    const apiKeyRepository = typeorm.getRepository(ApiKey);

    const record = await apiKeyRepository.findOne({where: [{
        key: token_fragments[0],
        secret: token_fragments[1]
    }]});

    if(!record) return unauthorized(res);

    await apiKeyRepository.update(record, {
        last_usage_at: new Date
    });

    req.user = record.user_id;

    return next();
}