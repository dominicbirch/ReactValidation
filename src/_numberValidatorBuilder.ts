import { HandlerBuilder } from "./_handlerBuilder";
import { requireBetween, requireMaximum, requireMinimum } from "./_utils";

/**Builder used to create validation handlers for numeric values. */
export class NumberValidatorBuilder extends HandlerBuilder<number> {
    /**Require that the number has a value greater than or equal to the value provided.
     * @param min The lowest acceptable value.
     * @param message An optional message describing the failure.
     */
    min(min: number, message?: string): this {
        return this.add(requireMinimum(min, message));
    }

    /**Require that the number has a value less than or equal to the value provided.
     * @param max The highest acceptable value.
     * @param message An optional message describing the failure.
    */
    max(max: number, message?: string): this {
        return this.add(requireMaximum(max, message));
    }

    /**Require that the number has a value between the constraints provided (inclusive).
     * @param min The lowest acceptable value.
     * @param max The highest acceptable value.
     * @param message An optional message describing the failure.
     */
    between(min: number, max: number, message?: string): this {
        return this.add(requireBetween(min, max, message));
    }
}