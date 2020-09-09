import React, { ReactElement, ReactPortal, useCallback, useMemo, useState } from "react";
import { AnyResult, ChangeHandler, ChangeHandlers, ValidationResult, ValidationRules } from "./_common";
import { ValidationContext } from "./_context";
import { anyFailures, applyValildationRules, isArrayValidator, isValidationRules } from "./_utils";

export interface SubjectProps<T = any, K extends keyof T = any> {
    results: ValidationResult<T>;
    values: T;
    changeHandlers?: ChangeHandlers<T>;
    submit: () => void;
    validate: (key?: K) => boolean;
}

export interface ValidationFormProps<T> {
    values: T;
    onChange?: ChangeHandler<T>
    rules?: ValidationRules<T>;
    provideContext?: boolean;
    action?: (valid: boolean) => void;
    render: (props: SubjectProps<T>) => ReactElement | ReactPortal;
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


export function ValidationForm<T, K extends keyof T>({ values, rules, provideContext, action, render, onChange }: ValidationFormProps<T>) {
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
        changeHandlers = useMemo(() => {
            if (onChange) {
                return Object.keys(values).reduce((r, k, i) => {
                    r[k as keyof T] = v => onChange(k as keyof T, v);

                    return r;
                }, {} as ChangeHandlers<T>);
            }
        }, [onChange, values]),

        childProps = useMemo(() => ({
            values,
            results,
            submit,
            validate,
            changeHandlers
        }), [values, results, submit, validate]);


    return provideContext
        ? <ValidationContext.Provider value={childProps}>
            {render(childProps)}
        </ValidationContext.Provider>
        : render(childProps);
};
