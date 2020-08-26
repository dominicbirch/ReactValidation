import { ArrayResult, ArrayValidator } from "_arrayValidator";

export type ReadOnly<T> = { readonly [P in keyof T]: ReadOnly<T[P]>; };
export type ElementType<T> = T extends (infer U)[] ? U : never;

export type ValidationResult<T = any> = {
    [P in keyof T]?: null | string[] | (T[P] extends any[] ? ArrayResult<ElementType<T[P]>> : T[P] extends Object ? ValidationResult<T[P]> : never);
};
export type ValidationHandler<T = any> = (value: T) => string[] | null;
export type Validator<T> = ValidationHandler<T> | (T extends any[] ? ArrayValidator<ElementType<T>> : T extends Object ? ValidationRules<T> : never);
export type ValidationRules<T = any> = {
    [P in keyof T]?: Validator<T[P]>;
};

export type AnyValidator<T> = ValidationHandler<T> | ValidationRules<T> | ArrayValidator<ElementType<T>>;
export type AnyResult<T> = null | string[] | ArrayResult<ElementType<T>> | ValidationResult<T>;