import { knex } from "../helpers";
import Exception from "../errors/Exception";
import { Validator } from 'jsonschema';
import { Request } from 'express';

export default async (req: Request, field: string, subject: any, schema: any) => {
    try {
        schema = JSON.parse(schema);
    } catch (error) {
        throw new Exception('Invalid exists schema.');
    }

    const validation_schema = {
        id: "UniqueSchema",
        type: "object",
        properties: {
            table: {
                type: 'string',
            },
            column: {
                type: 'string',
            }
        },
        required: [
            'table', 'column'
        ]
    };

    if(!((new Validator).validate(schema, validation_schema).errors.length === 0))
        throw new Exception('Invalid exists schema.');

    if(typeof subject !== 'string') return false;

    const record = await knex().table(schema.table)
        .where(schema.column, subject)
        .first();

    return record ? false : true;
}
