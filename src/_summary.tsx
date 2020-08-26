import React = require("react");
import { AnyResult } from "./_common";
import { anyFailures, isArrayResult } from "./_utils";


export interface ValidationSummaryProps<T = any> {
    value?: AnyResult<T>;
    className?: string;
    style?: React.CSSProperties;
}

export function ValidationSummary<T = any>({ value, className, style }: ValidationSummaryProps<T>) {
    const listProps = React.useMemo(() => ({ style, className: `validation-summary${className ? ` ${className}` : ""}` }), [className, style]);

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
                            const r = value.each && value.each[k];
                            return anyFailures(r)
                                ?
                                <li key={i}>
                                    {k}
                                    <ValidationSummary value={r} />
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
                            const r = value[k as keyof typeof value];

                            return anyFailures(r)
                                ?
                                <li key={i}>
                                    {k}
                                    <ValidationSummary value={r} />
                                </li>
                                : null;
                        })
                    }
                </ul>
            );
        }
    }

    return <></>;
}
