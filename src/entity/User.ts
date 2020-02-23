import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { injectable } from "inversify";

@Entity({name: 'users'})
@injectable()
export default class User {

    @PrimaryGeneratedColumn()
    id: any;

    @Column('varchar', { length: 40 })
    email: string;

    @Column('varchar')
    password: string;
}