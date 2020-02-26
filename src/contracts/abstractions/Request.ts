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
import RuleDefinition from "../interfaces/RuleDefinition";

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

    protected mapErrors(errors: any, field_errors: any)
    {
        for (const validation_field in field_errors){
            if (field_errors.hasOwnProperty(validation_field)) {
                errors[validation_field] = field_errors[validation_field];
            }
        }
    }

    protected fail(errors: any, req: ExpressRequest, res: Response, next: NextFunction)
    {
        if(accepts_json(req)) {

            const exception = new Exception('Invalid request payload.', 422, errors);

            return next(exception);
        }

        if(errors) {
            (<any> req).flash('validation-errors', errors);
        }

        return res.redirect(req.header('Referer') || '/');

    }

    protected parseRule(rule: string): RuleDefinition
    {
        let rule_sections = rule.split(':');

        const rule_name = rule_sections[0];

        let data = undefined;

        for (let j = 1; j < rule_sections.length; j++) {
            if(j == 1) {
                data = rule_sections[j];
            } else {
                data = `${data}:${rule_sections[j]}`;
            }
        }

        return {
            rule: rule_name,
            data: data
        };
    }

    protected valueSet(value: any): boolean
    {
        return !([undefined, null, false, ''].includes(value));
    }

    protected async validateField(req: ExpressRequest, field: string, rules: string)
    {
        const rule_fragments = rules.split('|');

        const field_value = req.body[field];

        var errors: any = {};

        const is_required = rule_fragments.includes('required');

        for (let i = 0; i < rule_fragments.length; i++) {

            const parsed_rule = this.parseRule(rule_fragments[i]);

            let validator_args = [field_value];

            if(parsed_rule.data !== undefined) validator_args.push(parsed_rule.data);


            if(is_required || this.valueSet(field_value)) {
                const is_valid = await this.rule_functions[parsed_rule.rule](...validator_args);

                if(is_valid !== true) {
                    if(!errors[field]) errors[field] = {};

                    errors[field][parsed_rule.rule] = this.getMessage(parsed_rule.rule);
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

    public validate = async (req: ExpressRequest, res: Response, next: NextFunction) =>
    {
        const rules = this.rules(req);

        var errors: any = {};

        try {
            for (const field in rules.rules){
                if (rules.rules.hasOwnProperty(field)) {
                    const field_errors = await this.validateField(req, field, rules.rules[field]);

                    this.mapErrors(errors, field_errors);
                }
            }
        } catch (error) {

            next(error);
        }

        if(Object.entries(errors).length == 0) return next();

        return this.fail(errors, req, res, next);
    }

    protected abstract rules(req: ExpressRequest): RequestInterface;
}