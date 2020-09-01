import React, { createElement, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { AnyResult, HigherOrderComponent, ValidationResult, ValidationRules } from "./_common";
import { ValidationContext } from "./_context";
import { anyFailures, applyValildationRules, isArrayValidator, isValidationRules } from "./_utils";

export interface SubjectProps<T = any, K extends keyof T = any> {
    results: ValidationResult<T>;
    values: T;
    submit: () => void;
    validate: (key?: K) => boolean;
}

export interface ValidationFormProps<T> {
    values: T;
    rules?: ValidationRules<T>;
    action?: (valid: boolean) => void;
    // provideContext?: boolean;
    //component: ComponentType<SubjectProps<T, K>>;
    //children: (props: SubjectProps<T, K>) => ReactElement | ReactPortal;
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


export function ValidationForm<T, K extends keyof T>({ values, rules, action, children }: PropsWithChildren<ValidationFormProps<T>>) {
    const
        [results, setResults] = useState({} as ValidationResult<T>),
        validate = useCallback((key?: K): boolean => {
            if (rules) {
                if (key) {
                    const r = validateKey(key, rules, values);
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


    return <ValidationContext.Provider value={childProps}>{children}</ValidationContext.Provider>;
};


export function withValidateProps<T>(rules: ValidationRules<T>): HigherOrderComponent<T, T & { results?: ValidationResult<T>; validate: (key?: string) => boolean; }> {
    //TODO:
    return Component => (props => createElement(Component, props));
}

