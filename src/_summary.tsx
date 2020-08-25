import { ValidationResults } from "./_form";
import { useValidation } from "./_hooks";
import React = require("react");

export type ValidationSummaryProps<T = any> = {
    value?: ValidationResults<T>;
}

function isObject(subject: any): subject is Object {
    return typeof subject === "object" && subject;
}

function renderResult<T extends ValidationResults, K extends keyof T>(key: K, value: T[K]) {
    if (Array.isArray(value)) {
        return (
            <li key={String(key)}>
                {key}
                <ul>
                    {value.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
            </li>);
    }
    if (isObject(value)) {
        return (
            <li key={String(key)}>
                {key}
                <ul>
                    {Object.keys(value).map(k => renderResult(k, value[k]))}
                </ul>
            </li>
        );
    }

    return <></>;
}

export function ValidationSummary<T = any>({ value }: ValidationSummaryProps<T>) {
    return (
        <ul className="validation-summary">
            {
                !!value
                    ? Object
                        .keys(value)
                        .map(k => renderResult(k as keyof T, value[k as keyof T]))
                    : function () {
                        const { results } = useValidation<T>();

                        return Object
                            .keys(results)
                            .map(k => renderResult(k as keyof T, results[k as keyof T]));
                    }()
            }
        </ul>
    );
}
