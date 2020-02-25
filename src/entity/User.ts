import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { injectable } from "inversify";
import bcrypt from 'bcryptjs';
import Account from "./Account";
import ApiKey from "./ApiKey";

@Entity({name: 'users'})
@injectable()
export default class User {

    @PrimaryGeneratedColumn()
    id: any;

    @Column('varchar', { length: 40 })
    email: string;

    @Column('varchar')
    password: string;

    @OneToMany(type => Account, account => account.user)
    accounts: Account[];

    @OneToMany(type => ApiKey, api_key => api_key.user)
    apiKeys: ApiKey[];

    public async validatePassword(password: string)
    {
        return bcrypt.compareSync(password, this.password);
    }
}