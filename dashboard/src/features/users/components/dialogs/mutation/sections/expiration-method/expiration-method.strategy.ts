import { useFormContext } from "react-hook-form";
import { ExpireStrategy } from "@marzneshin/features/users";

class ExpirationMethodErrorClear {
    protected clearErrors(form: ReturnType<typeof useFormContext>) {
        form.clearErrors("expire_date");
        form.clearErrors("usage_duration");
        form.clearErrors("activation_deadline");
    }
}

abstract class ExpirationMethodStrategy {
    abstract apply(form: ReturnType<typeof useFormContext>): void;
}

export class FirstUseStrategy
    extends ExpirationMethodErrorClear
    implements ExpirationMethodStrategy {

    apply(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire_strategy", "start_on_first_use");
        form.setValue("expire", undefined);
        this.clearErrors(form);
    }
}

export class NeverStrategy
    extends ExpirationMethodErrorClear
    implements ExpirationMethodStrategy {

    apply(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire_strategy", 'never');
        form.setValue("expire_date", undefined);
        form.setValue("activation_deadline", undefined);
        form.setValue("usage_duration", undefined);
        this.clearErrors(form);
    }
}

export class FixedStrategy
    extends ExpirationMethodErrorClear
    implements ExpirationMethodStrategy {

    apply(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire_strategy", 'fixed_date');
        form.setValue("on_hold_expire_duration", 0);
        form.setValue("activation_deadline", null);
        this.clearErrors(form);
    }
}

export const strategies: { [key in ExpireStrategy]: ExpirationMethodStrategy } = {
    start_on_first_use: new FirstUseStrategy(),
    never: new NeverStrategy(),
    fixed_date: new FixedStrategy(),
};
