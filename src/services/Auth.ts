import { Strategy as LocalStrategy, IVerifyOptions } from 'passport-local';
import { Request } from 'express';
import User from '../entity/User';
import { inject } from 'inversify';
import { Connection, Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import Exception from '../errors/Exception';

class Auth
{
    protected user: User;
    protected typeorm: Connection;
    protected userRepository: Repository<User>;

    constructor(
        @inject('User') user: User,
        @inject('typeorm') typeorm: Connection,
    ) {
        this.typeorm = typeorm;
        this.user = user;
        this.userRepository = typeorm.getRepository(User);
    }

    public login = async (req: Request, email: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) =>
    {
        const promise = new Promise(async (res, rej) => {

            const user = await this.userRepository.findOne({'email': email});

            if(!user){
                rej(new Exception('Invalid email or password.', 401));
            } else {
                const valid = await user.validatePassword(password);

                if(!valid){
                    rej(new Exception('Invalid email or password.', 401));
                }

                res(user);
            }
        });

        return promise
            .then(fulfilled => {
                done(null,fulfilled);
            })
            .catch(rejected => {
                done(null, false, {message: rejected.message});
            });
    }

    public register = async (req: Request, email: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) =>
    {
        const promise = new Promise(async (res, rej) => {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            this.user.email = email;
            this.user.password = hash;

            try {
                this.user = await this.userRepository.save(this.user);
            } catch (error) {

                return rej(error);
            }

            return res(this.user);
        })

        return promise
            .then(fulfilled => {

                done(null,fulfilled);
            })
            .catch(rejected => {
                done(null, false, {message: rejected.message});
            });
    }
}

export default Auth;