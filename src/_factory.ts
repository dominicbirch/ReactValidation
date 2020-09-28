import { ArrayValidatorBuilder } from "./_arrayValidatorBuilder";
import { DateValidatorBuilder } from "./_dateValidatorBuilder";
import { DefaultValidatorBuilder } from "./_defaultValidatorBuilder";
import { NumberValidatorBuilder } from "./_numberValidatorBuilder";
import { StringValidatorBuilder } from "./_stringValidatorBuilder";

export class ValidatorFactory {
    static get String() {
        return new StringValidatorBuilder();
    }

    static get Number() {
        return new NumberValidatorBuilder();
    }

    static get Date() {
        return new DateValidatorBuilder();
    }

    static Array<T>() {
        return new ArrayValidatorBuilder<T>();
    }

    static Default<T>() {
        return new DefaultValidatorBuilder<T>();
    }
}
