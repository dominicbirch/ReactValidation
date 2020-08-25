import { ValidationHandler } from "./_form";

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

export function requireValue(message: string = "Please provide an answer") {
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