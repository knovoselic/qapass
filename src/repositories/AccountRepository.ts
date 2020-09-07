import {EntityRepository, Brackets } from "typeorm";
import Account from "../entity/Account";
import Repository from "./Repository";

@EntityRepository(Account)
export default class AccountRepository extends Repository<Account>
{
    public ownedByUserOrPublic(user_id: number): Promise<Account[]>
    {
        if(!this.sqb) {
            this.sqb = this.createQueryBuilder();
        }

        return this.sqb
            .andWhere(new Brackets(qb => {
                qb.where('user_id = :user_id', {user_id: user_id})
                    .orWhere('public = 1');
            }))
            .getMany();
    }
}
