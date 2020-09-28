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

    /**Build and return the validator */
    public build(): ArrayValidator<T> {
        return new ArrayValidator<T>(this._all, this._each, this._formatKey);
    }

    /**Set a format for identifying elements */
    public withLabelFormat(formatLabel: ElementKeyFactory<T>) {
        this._formatKey = formatLabel;

        return this;
    }

    /**Set a series of handlers to be checked against the root __(all items)__. */
    public withRules(...rules: ValidationHandler<T[]>[]) {
        this._all = composeHandler(...rules);

        return this;
    }

    /**Set a series of handlers to be checked against __each__ item in the array. */
    public withRulesForEach(...rules: ValidationHandler<T>[]) {
        this._each = composeHandler(...rules);

        return this;
    }

    /**Set a single handler to be checked against __each__ item in the array. */
    public withRuleForEach(rule: Validator<T>) {
        this._each = rule;

        return this;
    }
}