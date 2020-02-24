import { Strategy as LocalStrategy } from 'passport-local';
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

    public login()
    {
        return new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req, email, password, done) => {

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

            promise
                .then(fulfilled => {

                    done(null,fulfilled);
                })
                .catch(rejected => {
                    done(rejected);
                });
        });
    }

    public register()
    {
        return new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
            }, (req, email, password, done) => {

                const promise = new Promise(async (res, rej) => {

                    if(await this.userRepository.findOne({'email': email})) {
                        return rej(new Exception('User with that email already exists.', 422));
                    }

                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);

                    this.user.email = email;
                    this.user.password = hash;

                    try {

                        this.user = await this.userRepository.save(this.user);

                        const user = await this.userRepository.findOne({'email': this.user.email})

                        if(user == null) {

                            throw new Exception('Error on fetching user from database.', 500);
                        }

                        this.user = user;

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
                        done(rejected);
                    });
        });
    }

    public async userById(id: number): Promise< User | null >
    {
        try {
            const user = await this.userRepository.findOne(id);

            if(!user) {

                return null;
            }

            return user;

        } catch (error) {
            throw error;
        }
    }
}

export default Auth;