import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { injectable } from "inversify";
import bcrypt from 'bcryptjs';

@Entity({name: 'users'})
@injectable()
export default class User {

    @PrimaryGeneratedColumn()
    id: any;

    @Column('varchar', { length: 40 })
    email: string;

    @Column('varchar')
    password: string;

    public async validatePassword(password: string)
    {
        return bcrypt.compareSync(password, this.password);
    }
}