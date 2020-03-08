import { typeorm } from "../helpers";
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

    const record = await typeorm().query(`
            SELECT 1 from ${schema.table}
            WHERE ${schema.table}.${schema.column} = ?
            LIMIT 1;
        `, [subject]);

    return record.length == 0 ? true : false;
}
