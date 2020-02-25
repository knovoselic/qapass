import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { injectable } from "inversify";
import User from "./User";

@Entity({name: 'api_keys'})
@injectable()
export default class ApiKey {

    @PrimaryGeneratedColumn()
    id: any;

    @Column('varchar')
    key: string;

    @Column('varchar')
    secret: string;

    @Column({ type: "integer" })
    user_id: number;

    @Column({ type: "datetime" })
    last_usage_at: Date;

    @ManyToOne(type => User, user => user.apiKeys)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
}