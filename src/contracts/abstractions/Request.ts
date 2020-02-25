import { Request as ExpressRequest, Response, NextFunction } from "express";
import { accepts_json } from '../../helpers';
import Exception from "../../errors/Exception";
import required from "../../validators/required";
import string from "../../validators/string";
import unique from "../../validators/unique";
import email from "../../validators/email";
import max from "../../validators/max";
import inValues from "../../validators/in";
import RequestInterface from "../interfaces/Request";
import RuleMapping from "../interfaces/RuleMapping";
import path from 'path';

export default abstract class Request
{
    protected rule_functions: RuleMapping;

    public constructor()
    {
        this.setupRuleFunctions();
    }

    protected setupRuleFunctions()
    {
        this.rule_functions = {
            required: required,
            string: string,
            email: email,
            max: max,
            in: inValues,
            unique: unique
        };
    }

    public validate = async (req: ExpressRequest, res: Response, next: NextFunction) =>
    {
        const rules = this.rules(req);

        var errors: any = {};

        try {
            for (const field in rules.rules){
                if (rules.rules.hasOwnProperty(field)) {
                    const field_errors = await this.validateField(req, field, rules.rules[field]);

                    for (const validation_field in field_errors){
                        if (field_errors.hasOwnProperty(validation_field)) {

                            let out_errors = field_errors[validation_field];

                            for (const error in out_errors) {
                                if(rules.messages) {
                                    if(rules.messages[`${validation_field}.${error}`]) {
                                        out_errors[error] = rules.messages[`${validation_field}.${error}`];
                                    } else if(rules.messages[error]) {
                                        out_errors[error] = rules.messages[error];
                                    }
                                }
                            }

                            errors[validation_field] = out_errors;
                        }
                    }
                }
            }
        } catch (error) {
            next(error);
        }

        if(Object.entries(errors).length == 0) {

            return next();
        } else {

            if(accepts_json(req)) {

                const exception = new Exception('Invalid request payload.', 422, errors);

                return next(exception);
            }

            if(errors) {
                (<any> req).flash('validation-errors', errors);
            }

            return res.redirect(req.header('Referer') || '/');
        }
    }

    protected async validateField(req: ExpressRequest, field: string, rules: string)
    {
        const rule_fragments = rules.split('|');

        const field_value = req.body[field];

        var errors: any = {};

        const is_required = rule_fragments.includes('required');

        for (let i = 0; i < rule_fragments.length; i++) {
            let rule_sections = rule_fragments[i].split(':');

            const rule = rule_sections[0];

            let data = null

            for (let j = 1; j < rule_sections.length; j++) {
                if(j == 1) data = rule_sections[j];
                else data = `${data}:${rule_sections[j]}`
            }

            if(
                !data && (
                    is_required || field_value
                )
            ) {
                const r = await this.rule_functions[rule](field_value);

                if(r !== true) {
                    if(!errors[field]) {
                        errors[field] = {};
                    }

                    if(typeof r === 'string') {
                        errors[field][rule] = r;
                    } else {
                        errors[field][rule] = this.getMessage(rule);
                    }
                }
            } else if(is_required || field_value) {
                const r = await this.rule_functions[rule](field_value, data);

                if(r !== true) {
                    if(!errors[field]) {
                        errors[field] = {};
                    }

                    if(typeof r === 'string') {
                        errors[field][rule] = r;
                    } else {
                        errors[field][rule] = this.getMessage(rule);
                    }
                }
            }
        }

        return errors;
    }

    protected getMessage(rule: string): string
    {
        const obj = require(
            path.resolve(`${__dirname}/../../../storage/app/dictionaries/validation.json`)
        );

        let result = obj;

        result = obj[rule];

        if(!result) {

            result = 'Invalid value.';
        }

        return result;
    }

    protected abstract rules(req: ExpressRequest): RequestInterface;
}