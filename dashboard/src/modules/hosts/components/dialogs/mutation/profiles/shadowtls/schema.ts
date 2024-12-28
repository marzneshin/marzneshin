import { z } from "zod";
import { HostSchema, TlsSchema } from "@marzneshin/modules/hosts";

export const ShadowTlsSchema =
    HostSchema.merge(TlsSchema);

export type ShadowTlsSchemaType = z.infer<typeof ShadowTlsSchema>;
