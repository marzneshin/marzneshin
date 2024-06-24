import { useFormContext } from "react-hook-form";
import { ExpirationMethod } from "./expiration-method.type"

class ExpirationMethodErrorClear {
    protected clearErrors(form: ReturnType<typeof useFormContext>) {
        form.clearErrors("expire");
        form.clearErrors("on_hold_expire_duration");
        form.clearErrors("on_hold_timeout");
    }
}

abstract class ExpirationMethodStrategy {
    abstract apply(form: ReturnType<typeof useFormContext>): void;
}

export class OnHoldStrategy
    extends ExpirationMethodErrorClear
    implements ExpirationMethodStrategy {

    apply(form: ReturnType<typeof useFormContext>) {
        form.setValue("status", 'on_hold');
        form.setValue("expire", undefined);
        this.clearErrors(form);
    }
}

export class UnlimitedStrategy
    extends ExpirationMethodErrorClear
    implements ExpirationMethodStrategy {

    apply(form: ReturnType<typeof useFormContext>) {
        form.setValue("status", 'active');
        form.setValue("expire", 0);
        form.setValue("on_hold_expire_duration", undefined);
        form.setValue("on_hold_timeout", undefined);
        this.clearErrors(form);
    }
}

export class DeterminedStrategy
    extends ExpirationMethodErrorClear
    implements ExpirationMethodStrategy {

    apply(form: ReturnType<typeof useFormContext>) {
        form.setValue("status", 'active');
        form.setValue("on_hold_expire_duration", 0);
        form.setValue("on_hold_timeout", null);
        this.clearErrors(form);
    }
}

export const strategies: { [key in ExpirationMethod]: ExpirationMethodStrategy } = {
    onhold: new OnHoldStrategy(),
    unlimited: new UnlimitedStrategy(),
    determined: new DeterminedStrategy(),
};
