import { AnyResult, ValidationHandler, Validator } from "./_common";
import { applyValildationRules, isArrayValidator, isValidationRules } from "./_utils";

export class ArrayResult<T = any> {
    constructor(readonly all: null | string[], readonly each?: AnyResult<T>[]) {
    }

    public isValid(): boolean {
        return (this.all === null || typeof this.all === "undefined")
            && (this.each === null || typeof this.each === "undefined" || !this.each.some(r => !!r));
    }
}


export class ArrayValidator<T = any>{
    constructor(readonly all: ValidationHandler<T[]> = () => null, readonly each: Validator<T> = () => null) {
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
            ? new ArrayResult<T>(all, each)
            : new ArrayResult<T>(all);
    }
}
