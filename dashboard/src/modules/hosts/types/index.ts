import { z } from "zod";
import { HostSchema } from "@marzneshin/modules/hosts";

export type HostSchemaType = z.infer<typeof HostSchema>;
export type HostType = HostSchemaType & { id?: number };
