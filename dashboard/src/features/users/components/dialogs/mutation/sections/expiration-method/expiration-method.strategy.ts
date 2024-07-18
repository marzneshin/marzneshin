import { useFormContext } from "react-hook-form";
import { ExpireStrategy } from "@marzneshin/features/users";

abstract class ExpirationMethodStrategy {
    protected abstract applyFieldValues(form: ReturnType<typeof useFormContext>): void;

    protected clearErrors(form: ReturnType<typeof useFormContext>) {
        form.clearErrors("expire_date");
        form.clearErrors("usage_duration");
        form.clearErrors("activation_deadline");
    }

    public apply(form: ReturnType<typeof useFormContext>) {
        this.applyFieldValues(form)
        this.clearErrors(form)
    }
}

export class FirstUseStrategy extends ExpirationMethodStrategy {

    protected applyFieldValues(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire_strategy", "start_on_first_use");
        form.setValue("expire", undefined);
    }
}

export class NeverStrategy
    extends ExpirationMethodStrategy {

    protected applyFieldValues(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire_strategy", "never");
        form.setValue("expire_date", undefined);
        form.setValue("activation_deadline", undefined);
        form.setValue("usage_duration", undefined);
    }
}

export class FixedStrategy
    extends ExpirationMethodStrategy {

    protected applyFieldValues(form: ReturnType<typeof useFormContext>) {
        form.setValue("expire_strategy", "fixed_date");
        form.setValue("on_hold_expire_duration", 0);
        form.setValue("activation_deadline", null);
    }
}

export const strategies: { [key in ExpireStrategy]: ExpirationMethodStrategy } = {
    start_on_first_use: new FirstUseStrategy(),
    never: new NeverStrategy(),
    fixed_date: new FixedStrategy(),
};
