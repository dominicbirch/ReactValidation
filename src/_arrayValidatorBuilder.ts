import type { Builder, ValidationHandler, Validator } from "./_common";
import { ArrayValidator, ElementKeyFactory } from "./_arrayValidator";
import { composeHandler } from "./_utils";

export class ArrayValidatorBuilder<T = any> implements Builder<ArrayValidator<T>>{
    private _all;
    private _each;
    private _formatKey;

    constructor(private readonly instance: ArrayValidator<T> = new ArrayValidator<T>()) {
        this._all = instance.all;
        this._each = instance.each;
        this._formatKey = instance.formatKey;
    }

    public build(): ArrayValidator<T> {
        return new ArrayValidator<T>(this._all, this._each, this._formatKey);
    }

    public withLabelFormat(formatLabel: ElementKeyFactory<T>) {
        this._formatKey = formatLabel;

        return this;
    }

    public withRules(...rules: ValidationHandler<T[]>[]) {
        this._all = composeHandler(...rules);

        return this;
    }

    public withRulesForEach(...rules: ValidationHandler<T>[]) {
        this._each = composeHandler(...rules);

        return this;
    }

    public withRuleForEach(rule: Validator<T>) {
        this._each = rule;

        return this;
    }
}