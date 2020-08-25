import { createElement, useState, useMemo, useCallback } from "react";
import ValidationContext from "./_context";

export type ValidationResult = string[] | null | undefined;
export type ValidationHandler<T = any> = (value: T) => ValidationResult;
export type ValidationHandlers<T = any> = { [P in keyof T]?: ValidationHandlers<T[P]> | ValidationHandler<T[P]> };
export type ValidationResults<T = any> = { [P in keyof T]?: ValidationResults<T[P]> | ValidationResult; };

export interface SubjectProps<T = any, K extends keyof T = any> {
    results: ValidationResults<T>;
    values: T;
    submit: () => void;
    validate: (key?: K) => boolean;
}

export interface ValidationFormProps<T, K extends keyof T> {
    values: T;
    rules: ValidationHandlers<T>;
    action?: (valid: boolean) => void;
    provideContext?: boolean;
    component: React.ComponentType<SubjectProps<T, K>>;
}

function isSingleRule<T>(subject?: ValidationHandler<T> | ValidationHandlers<T>): subject is ValidationHandler<T> {
    return !!(typeof subject === "function");
}
function isMultiRule<T>(subject?: ValidationHandler<T> | ValidationHandlers<T>): subject is ValidationHandlers<T> {
    return !!(subject && Object.keys(subject));
}

function validateKey<T, K extends keyof T>(key: K, rules: ValidationHandlers<T>, values: T): ValidationResult | ValidationResults<T[K]> {
    const rule = rules[key];

    if (isSingleRule(rule)) {
        return rule(values[key]);
    }
    if (isMultiRule(rule)) {
        return Object
            .keys(rule)
            .reduce((x, k, i) => {
                x[k as keyof T[K]] = validateKey(k as keyof T[K], rule, values[key]);
                return x;
            }, {} as ValidationResults<T[K]>);
    }

    return null;
}

function anyFailures<T>(results: ValidationResults<T> | ValidationResult): boolean {
    if (!results) { return false; }

    return Array.isArray(results)
        ? !!results.length
        : Object.keys(results).some(k => anyFailures(results[k as keyof T]))
}


export function ValidationForm<T, K extends keyof T>({ values, rules, action, provideContext, component: Subject }: ValidationFormProps<T, K>) {
    const
        [results, setResults] = useState({} as ValidationResults<T>),
        validate = useCallback((key?: K): boolean => {
            if (key) {
                let r = validateKey(key, rules, values);
                setResults({ ...results, [key]: r });

                return !anyFailures(r);
            }

            setResults({});
            if (!rules) { return true; }

            const updatedResults = Object
                .keys(rules)
                .reduce((r, k, i) => {
                    r[k as K] = validateKey(k as K, rules, values);
                    return r;
                }, {} as ValidationResults<T>);

            setResults(updatedResults);

            return !anyFailures(updatedResults);
        }, [rules, values, setResults]),
        submit = useCallback(() => {
            const valid = validate();
            if (action) {
                action(valid);
            }
        }, [action, validate]),

        childProps = useMemo(() => ({
            values,
            results,
            submit,
            validate
        }), [values, results, submit, validate]);


    return provideContext
        ? createElement(ValidationContext.Provider, { value: childProps }, createElement(Subject, childProps))
        : createElement(Subject, childProps);
};