import { Container, injectable, decorate } from 'inversify';
import 'reflect-metadata';
import knex from 'knex';
import '../controllers/AuthController';
import '../controllers/AccountController';
import '../controllers/ApiKeyController';
import '../controllers/ApiController';
import { createConnection, Connection } from 'typeorm';
import User from '../entity/User';
import Account from '../entity/Account';
import ApiKey from '../entity/ApiKey';
import Auth from './Auth';
import ApiKeyListTransformer from '../transformers/ApiKeyListTransformer';
import AccountFilter from '../filters/AccountFilter';
import AccountListTransformer from '../transformers/AccountListTransformer';

decorate(injectable(), Connection);

export default class ServiceProvider
{
    static instance: ServiceProvider;

    private container: Container;

    constructor() {
        this.container = new Container;
    }

    public static get = async (): Promise<ServiceProvider> => {
        if(ServiceProvider.instance == null) {
            ServiceProvider.instance = new ServiceProvider;

            await ServiceProvider.instance.database();

            await ServiceProvider.instance.register();
        }

        return ServiceProvider.instance;
    }

    public getContainer = (): Container => {

        return this.container;
    }

    protected database = async () => {
        let port: number = 3306;

        if(process.env.DB_PORT) {
            port = parseInt(process.env.DB_PORT);
        }

        const knexConn = knex({
            client: 'mysql',
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                port: port
            }
        });

        this.container
            .bind<knex>('knex')
            .toConstantValue(knexConn);

        const connection = await createConnection();

        this.container
            .bind<Connection>('typeorm')
            .toConstantValue(connection);
    };

    /**
     * Binding registration
     *
     * @protected
     * @memberof ServiceProvider
     */
    protected register = async () => {

        this.container
            .bind<User>('User')
            .to(User);

        this.container
            .bind<Account>('Account')
            .to(Account);

        this.container
            .bind<ApiKey>('ApiKey')
            .to(ApiKey);

        this.container
            .bind<ApiKeyListTransformer>('ApiKeyListTransformer')
            .to(ApiKeyListTransformer);

        this.container
            .bind<AccountFilter>('AccountFilter')
            .to(AccountFilter);

        this.container
            .bind<AccountListTransformer>('AccountListTransformer')
            .to(AccountListTransformer);

        this.container
            .bind<Auth>('Auth')
            .toDynamicValue(() : Auth => {
                return new Auth(
                    this.container.get('User'),
                    this.container.get('typeorm')
                );
            })
            .inRequestScope();
    };
}