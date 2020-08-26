import { createElement, useState, useMemo, useCallback } from "react";
import ValidationContext from "./_context";
import { ValidationResult, ValidationRules, AnyResult } from "_common";
import { anyFailures, isArrayValidator, isValidationRules, applyValildationRules } from "_utils";

export interface SubjectProps<T = any, K extends keyof T = any> {
    results: ValidationResult<T>;
    values: T;
    submit: () => void;
    validate: (key?: K) => boolean;
}

export interface ValidationFormProps<T, K extends keyof T> {
    values: T;
    rules?: ValidationRules<T>;
    action?: (valid: boolean) => void;
    provideContext?: boolean;
    component: React.ComponentType<SubjectProps<T, K>>;
}

function validateKey<T, K extends keyof T>(key: K, rules: ValidationRules<T>, values: T): AnyResult<T[K]> {
    const rule = rules[key];

    if (rule) {
        if (typeof rule === "function") {
            return rule(values[key]);
        }

        const value = values[key];
        if (isArrayValidator<T[K]>(rule) && Array.isArray(value)) {
            return rule.validate(value);
        }
        if (isValidationRules<T[K]>(rule)) {
            return applyValildationRules(rule, value);
        }
    }

    return null;
}


export function ValidationForm<T, K extends keyof T>({ values, rules, action, provideContext, component: Subject }: ValidationFormProps<T, K>) {
    const
        [results, setResults] = useState({} as ValidationResult<T>),
        validate = useCallback((key?: K): boolean => {
            if (rules) {
                if (key) {
                    let r = validateKey(key, rules, values);
                    setResults({ ...results, [key]: r });

                    return !anyFailures(r);
                }

                const updatedResults = applyValildationRules(rules, values);
                setResults(updatedResults);

                return !anyFailures(updatedResults);
            }

            return true;
        }, [rules, values]),
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
