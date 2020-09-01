import React, { CSSProperties, useMemo } from "react";
import { useValidation } from "./_hooks";
import { AnyResult } from "./_common";
import { anyFailures, isArrayResult } from "./_utils";


export interface ValidationSummaryProps {
    className?: string;
    style?: CSSProperties;
}

function renderSummary<T = any>(value: AnyResult<T>, listProps?: any) {
    if (anyFailures(value)) {
        if (Array.isArray(value)) {
            return (
                <ul {...listProps}>
                    {value.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
            );
        }
        if (isArrayResult(value)) {
            return (
                <ul {...listProps}>
                    {
                        anyFailures(value.all) &&
                        value.all?.map((m, i) => <li key={-i}>{m}</li>)
                    }
                    {
                        value.each &&
                        Object.keys(value.each).map((k, i) => {
                            const r = (value.each && value.each[k]) || null;
                            return anyFailures(r)
                                ?
                                <li key={i}>
                                    {k}
                                    {renderSummary(r)}
                                </li>
                                : null;
                        })
                    }
                </ul>
            );
        }
        if (typeof value === "object" && anyFailures(value)) {
            return (
                <ul {...listProps}>
                    {
                        value &&
                        Object.keys(value).map((k, i) => {
                            const r = (value[k as keyof typeof value]);

                            return anyFailures(r) &&
                                <li key={i}>
                                    {k}
                                    {renderSummary(r as T[keyof T])}
                                </li>;
                        })
                    }
                </ul>
            );
        }
    }

    return <></>;
}


export function ValidationSummary<T = any>({ className, style }: ValidationSummaryProps) {
    const
        listProps = useMemo(() => ({ style, className: `validation-summary${className ? ` ${className}` : ""}` }), [className, style]),
        { results } = useValidation<T>();

    return renderSummary(results, listProps);
}
