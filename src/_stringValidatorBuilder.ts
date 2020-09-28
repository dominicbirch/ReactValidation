import { DefaultValidatorBuilder } from "./_defaultValidatorBuilder";
import { requireLengthBetween, requireMaximumLength, requireMinimumLength, requirePattern } from "./_utils";

/**Builder used to create validation handlers for string values */
export class StringValidatorBuilder extends DefaultValidatorBuilder<string> {
    /**Require that the value has a length of at least `length`.
     * @param length The shortest acceptable length.
     * @param message An optional message describing the failure.
     */
    minLength(length: number, message?: string): this {
        return this.add(requireMinimumLength(length, message));
    }

    /**Require that the value has a length of no more than `length`.
     * @param length The longest acceptable length.
     * @param message An optional message describing the failure.
     */
    maxLength(length: number, message?: string): this {
        return this.add(requireMaximumLength(length, message));
    }

    /**Require that the value has a length between `min` and `max` (inclusive).
     * @param min The shortest acceptable length.
     * @param max The longest acceptable length.
     * @param message An optional message describing the failure.
     */
    lengthBetween(min: number, max: number, message?: string): this {
        return this.add(requireLengthBetween(min, max, message));
    }

    /**Require that the value matches the regular expression provided.
     * @param pattern The regular expression pattern describing a valid value.
     * @param message An optional message describing the failure.
     */
    match(pattern: RegExp, message?: string): this {
        return this.add(requirePattern(pattern, message));
    }
}