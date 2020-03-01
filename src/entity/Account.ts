import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { injectable } from "inversify";
import User from "./User";

@Entity({name: 'accounts'})
@injectable()
export default class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    username: string;

    @Column('varchar')
    password: string;

    @Column('varchar')
    host: string;

    @Column('varchar')
    description: string;

    @Column('boolean')
    public: boolean;

    @Column({ type: "integer" })
    user_id: number;

    @ManyToOne(type => User, user => user.accounts)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
}