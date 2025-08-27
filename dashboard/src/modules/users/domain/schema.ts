import { z } from "zod";
import { DATA_LIMIT_METRIC } from "@marzneshin/modules/users";

export const UserSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    note: z.string().nullable(),
    data_limit: z
        .union([z.string().transform((str) => Number(str)), z.number()])
        .refine((val) => val >= 0, { message: "The minimum number is 0" })
        .transform((val) => Math.round(val * DATA_LIMIT_METRIC))
        .nullable()
        .optional(),
    data_limit_reset_strategy: z
        .enum(["no_reset", "day", "week", "month", "year"])
        .or(z.number())
        .or(z.string())
        .nullable()
        .optional(),
    expire_strategy: z.enum(["never", "fixed_date", "start_on_first_use"]),
    usage_duration: z.number().max(9999 * 365 * 24 * 60 * 60, { message: "usage_duration must be less than 3649635" })
        .nullable().optional(),
    activation_deadline: z.string().or(z.date()).nullable().optional(),
    expire_date: z.string().or(z.date()).nullable().optional(),
    service_ids: z
        .array(z.number().or(z.string()))
        .nonempty({ message: "At least one service is required" })
        .transform((v) => v.map(Number)),
}).refine(
    (data) =>
        data.expire_strategy !== "start_on_first_use" || data.usage_duration || data.usage_duration != 0,
    {
        message: "usage_duration is required when expire_strategy is 'start_on_first_use'",
        path: ["usage_duration"],
    }
)
    .refine(
        (data) =>
            data.expire_strategy !== "fixed_date" || data.expire_date,
        {
            message: "expire_date is required when expire_strategy is 'fixed_date'",
            path: ["expire_date"],
        }
    );

export type UserMutationType = z.infer<typeof UserSchema>;
