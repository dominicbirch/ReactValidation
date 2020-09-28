import { HandlerBuilder } from "./_handlerBuilder";


export class DateValidatorBuilder extends HandlerBuilder<Date>{
    past(message = "Must be in the past"): this {
        return this.add(d => d.getTime() >= Date.now() ? [message] : null);
    }
    future(message = "Must be in the future"): this {
        return this.add(d => d.getTime() <= Date.now() ? [message] : null);
    }

    before(date: Date, message?: string): this {
        return this.add(d => d.getTime() >= Date.now() ? [message || `Must be before ${date.toISOString()}`] : null);
    }
    after(date: Date, message?: string): this {
        return this.add(d => d.getTime() <= Date.now() ? [message || `Must be after ${date.toISOString()}`] : null);
    }
    between(start: Date, end: Date, message?: string): this {
        const m = message || `Must be between ${start.toISOString()} and ${end.toISOString()}`;

        return this.add(d => d.getTime() < start.getTime()
            ? [m]
            : d.getTime() > end.getTime()
                ? [m]
                : null);
    }

    onOrBefore(date: Date, message?: string): this {
        return this.add(d => d.getTime() > Date.now() ? [message || `Must be before or equal to ${date.toISOString()}`] : null);
    }
    onOrAfter(date: Date, message?: string): this {
        return this.add(d => d.getTime() < Date.now() ? [message || `Must be after or equal to ${date.toISOString()}`] : null);
    }

    /**Asserts that the value must be on one of the days of the week provided
     * 1 is Monday
     * 
     * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay}
     */
    days(message: string, ...daysOfWeek: number[]) {
        return this.add(d => {
            const day = d.getDay();

            return daysOfWeek.some(x => x === day)
                ? null
                : [message]
        });
    }
}