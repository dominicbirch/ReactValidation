import type { SubjectProps } from "./_form"
import { useContext } from "react"
import { ValidationContext } from "./_context"

/**Returns the {@link SubjectProps} for the nearest parent validation context. */
export function useValidation<T = any>(): SubjectProps<T, keyof T> {
    const context = useContext(ValidationContext);
    if (!context) { throw new Error(ValidationContext.displayName + " was not provided"); }

    return context as SubjectProps<T, keyof T>;
}