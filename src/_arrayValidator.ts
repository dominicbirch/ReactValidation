import type { AnyResult, ValidationHandler, Validator, ValidationResult } from "./_common";
import { applyValildationRules, isArrayValidator, isValidationRules, anyFailures } from "./_utils";

export type ResultsDictionary<T = any> = { [key: string]: ValidationResult<T>; };
export type ElementKeyFactory<T> = (index: number, element: T) => string;

export class ArrayResult<T = any> {
    constructor(readonly all: null | string[], readonly each?: ResultsDictionary<T>) {
    }

    public isValid(): boolean {
        return (this.all === null || typeof this.all === "undefined")
            && (this.each === null || typeof this.each === "undefined" || !Object.keys(this.each).some(k => anyFailures(this.each && this.each[k])));
    }
}


function applyRule<T>(validator: Validator<T>, value: T): AnyResult<T> {
    if (typeof validator === "function") {
        return validator(value);
    }
    if (isArrayValidator<T>(validator) && Array.isArray(value)) {
        return validator.validate(value);
    }
    if (isValidationRules<T>(validator)) {
        return applyValildationRules(validator, value);
    }

    return null;
}

/**Generic array validator
 * @typeparam T The type of each element in arrays to be validated
 */
export class ArrayValidator<T = any>{
    constructor(readonly all: ValidationHandler<T[]> = () => null, readonly each: Validator<T> = () => null, readonly formatKey: ElementKeyFactory<T> = i => String(i)) {
    }

    public validate(values: T[]) {
        const all = this.all(values);

        let each: AnyResult<T>[] = values
            .map(v => {
                if (typeof this.each === "function") {
                    return this.each(v);
                }

                const rule = this.each;
                if (isArrayValidator<typeof v>(rule) && Array.isArray(v)) {
                    return rule.validate(v);
                }
                if (isValidationRules<typeof v>(rule)) {
                    return applyValildationRules(rule, v);
                }

                return null;
            })
            .filter(r => !!r);

        return each?.length
            ? new ArrayResult<T>(all, values.reduce((r, value, i) => ({
                ...r,
                [this.formatKey(i, value)]: applyRule(this.each, value)
            }), {}))
            : new ArrayResult<T>(all);
    }
}
