import { ValidationHandler, ValidationRules, ElementType, Validator, AnyValidator, ValidationResult, AnyResult } from "./_common";
import { ArrayValidator, ArrayResult } from "./_arrayValidator";


export function isValidationRules<T>(subject?: AnyValidator<T>): subject is ValidationRules<T> {
    return !!(typeof subject === "object" && Object.keys(subject).length);
}

export function isArrayValidator<T>(subject?: AnyValidator<T>): subject is ArrayValidator<ElementType<T>> {
    return subject instanceof ArrayValidator;
}

export function isArrayResult<T>(subject?: AnyResult<T>): subject is ArrayResult<ElementType<T>> {
    return subject instanceof ArrayResult;
}


export function composeHandler<T = any>(...handlers: ValidationHandler<T>[]): ValidationHandler<T> {
    if (!handlers || !handlers.length) {
        return (x: T) => null;
    }

    return v => {
        let result = handlers
            .reduce((r, h, i) => [...r, ...(h(v) || [])], <string[]>[])
            .filter(r => !!r);

        return result.length ? result : null;
    };
}

export function anyFailures<T>(results?: AnyResult<T>): boolean {
    if (results) {
        if (Array.isArray(results)) {
            return results.some(r => !!r);
        }
        if (results instanceof ArrayResult) {
            return !results.isValid();
        }
        if (typeof results === "object") {
            return Object.keys(results).some(k => anyFailures(results[k as keyof typeof results]));
        }
    }

    return false;
}

export function applyValildationRules<T>(rules: ValidationRules<T>, value: T): ValidationResult<T> {
    return Object.keys(rules).reduce((r, k, i) => {
        const key = k as keyof typeof rules;
        if (rules[key]) {

        }

        return r;
    }, <ValidationResult<T>>{});
}


function hasValue<T>(v: T): boolean {
    if (typeof v === "undefined" || v === null) {
        return false;
    }

    if ((typeof v === "number" || typeof v === "bigint") && v === NaN) {
        return false;
    }

    if (typeof v === "string" && /^\w*$/i.test(v)) {
        return false;
    }

    if (Array.isArray(v) && !v.length) {
        return false;
    }

    if (typeof v === "object" && !Object.keys(v).length) {
        return false;
    }

    return true;
}

export function requireValue(message: string = "Please provide an answer"): ValidationHandler {
    return <T>(v: T) => hasValue(v)
        ? null
        : [message];
}

export function requireMinimum(min: number, message?: string): ValidationHandler<number> {
    return v => (hasValue(v) && v < min)
        ? [message || `The value must not be less than ${min}`]
        : null;
}

export function requireMaximum(max: number, message?: string): ValidationHandler<number> {
    return v => (hasValue(v) && v > max)
        ? [message || `The value must not be more than ${max}`]
        : null;
}

export function requireBetween(min: number, max: number, message?: string): ValidationHandler<number> {
    return v => (hasValue(v) && (v < min || v > max))
        ? [message || `The value should be between ${min} and ${max}`]
        : null;
}

export function requireMinimumLength(min: number, message?: string): ValidationHandler<string | any[]> {
    return v => (hasValue(v) && v.length < min)
        ? [message || (Array.isArray(v) ? `There should be at least ${min} items` : `The value should be at least ${min} characters in length`)]
        : null;
}

export function requireMaximumLength(max: number, message?: string): ValidationHandler<string | any[]> {
    return v => (hasValue(v) && v.length > max)
        ? [message || (Array.isArray(v) ? `There should be no more than ${max} items` : `The value should be no more than ${max} characters in length`)]
        : null;
}

export function requireLengthBetween(min: number, max: number, message?: string): ValidationHandler<string | any[]> {
    return v => (hasValue(v) && (v.length < min || v.length > max))
        ? [message || (Array.isArray(v) ? `There should be between ${min} and ${max} items` : `The value should be between ${min} and ${max} characters in length`)]
        : null;
}

export function requirePattern(pattern: RegExp, message = "The answer provided is invalid"): ValidationHandler<string> {
    return v => pattern.test(v || "")
        ? null
        : [message];
}
