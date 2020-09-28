import type { Builder, Predicate, ValidationHandler } from "./_common";
import { requirePredicate, requireValue } from "./_utils";

export class HandlerBuilder<T> implements Builder<ValidationHandler<T>>{
    private _handlers: ValidationHandler<T>[] = [];

    build(): ValidationHandler<T> {
        throw new Error("Method not implemented.");
    }

    /**Add the handler provided to the handler being built.
     * @param handler The validation handler or rule to be added.
     */
    protected add(handler: ValidationHandler<T>): this {
        this._handlers.push(handler);

        return this;
    }

    /**Require that a value is provided.
     * @param message An optional message describing the failure.
     */
    required(message?: string): this {
        return this.add(requireValue(message));
    }

    /**Add handling so that the predicate provided is a requirement of the handler being built.
     * @param predicate The requirement to validate.
     * @param message An optional message describing the failure.
     */
    must(predicate: Predicate<T>, message?: string): this {
        return this.add(requirePredicate(predicate, message));
    }
}