import { ComponentType } from "react";
import { ArrayResult, ArrayValidator } from "./_arrayValidator";

export type ElementType<T> = T extends (infer U)[] ? U : never;

export type ValidationResult<T = any> = {
    [P in keyof T]?: AnyResult<T[P]>;
};
export type ValidationHandler<T = any> = (value: T) => string[] | null;
export type Validator<T> = ValidationHandler<T> | (T extends any[] ? ArrayValidator<ElementType<T>> : T extends Object ? ValidationRules<T> : never);
export type ValidationRules<T = any> = {
    [P in keyof T]?: Validator<T[P]>;
};

export type AnyValidator<T> = ValidationHandler<T> | ValidationRules<T> | ArrayValidator<ElementType<T>>;
export type AnyResult<T> = null | string[] | ArrayResult<ElementType<T>> | ValidationResult<T>;

export type Predicate<T> = (value: T) => boolean;

export interface Builder<T> {
    build(): T;
}

export type HigherOrderComponent<T = any, O extends T = T> = (component: ComponentType<T>) => ComponentType<O>;
