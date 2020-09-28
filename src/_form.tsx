import React, { ReactElement, ReactPortal, useCallback, useMemo, useState } from "react";
import type { AnyResult, ChangeHandler, ChangeHandlers, ValidationResult, ValidationRules } from "./_common";
import { ValidationContext } from "./_context";
import { anyFailures, applyValildationRules, isArrayValidator, isValidationRules } from "./_utils";

/**Abstraction of the properties which may be bound to children of {@link ValidationForm}.  */
export interface SubjectProps<T = any, K extends keyof T = any> {
    /**The most recent results from validating `values` */
    results: ValidationResult<T>;
    /**The values as they are to be validated */
    values: T;
    /**Optional value change handlers which are automatically connected to `onChange` of the nearest parent validation form or context value. */
    changeHandlers?: ChangeHandlers<T>;
    /**Validate and invoke the action of the nearest parent form or context. */
    submit: () => void;
    /**Validate the specified key and return an indication of the outcome.
     * `true` if the value for the key was valid.
     */
    validate: (key?: K) => boolean;
}

export interface ValidationFormProps<T> {
    /**The current values to be validated. */
    values: T;
    /**Optional change handler receiving the key and new value.
     * This is automatically connected to {@link SubjectProps.changeHandlers}
     */
    onChange?: ChangeHandler<T>;
    /**The validation rules to be applied to {@link ValidationFormProps.values} */
    rules?: ValidationRules<T>;
    /**If `true` {@link SubjectProps} will be provided to children of the form via the react context api. */
    provideContext?: boolean;
    /**The action to be taken when the user attempts to submit the form.
     * @param valid `true` if the current state of {@link values} was valid, otherwise `false`.
     */
    action?: (valid: boolean) => void;
    /**The function component to be rendered as the forms children. */
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


/**Represents the root of a component tree in the context of validation */
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
