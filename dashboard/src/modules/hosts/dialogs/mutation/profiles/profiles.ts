import {
    GeneralSchema,
    GeneralProfileFields,
    generalProfileDefaultValue,
} from "./general";
import {
    WireguardSchema,
    WireguardProfileFields,
    wireguardProfileDefaultValue,
} from "./wireguard";
import {
    Hysteria2Schema,
    Hysteria2ProfileFields,
    hysteria2ProfileDefaultValue,
} from "./hysteria2";
import {
    ShadowTlsSchema,
    ShadowTlsProfileFields,
    shadowTlsProfileDefaultValue,
} from "./shadowtls";
import { TuicSchema, TuicProfileFields, tuicProfileDefaultValue } from "./tuic";
import { FC } from "react";
import { z } from "zod";
import { ProtocolType } from "@marzneshin/modules/inbounds";

export type ProfileConfig = [z.ZodTypeAny, FC, object];

export const generalProfile: ProfileConfig = [
    GeneralSchema,
    GeneralProfileFields,
    generalProfileDefaultValue,
];

export const profileByProtocol: Record<ProtocolType, ProfileConfig> = {
    vless: generalProfile,
    vmess: generalProfile,
    trojan: generalProfile,
    shadowsocks: generalProfile,
    shadowsocks2022: generalProfile,
    wireguard: [
        WireguardSchema,
        WireguardProfileFields,
        wireguardProfileDefaultValue,
    ],
    hysteria2: [
        Hysteria2Schema,
        Hysteria2ProfileFields,
        hysteria2ProfileDefaultValue,
    ],
    shadowtls: [
        ShadowTlsSchema,
        ShadowTlsProfileFields,
        shadowTlsProfileDefaultValue,
    ],
    tuic: [TuicSchema, TuicProfileFields, tuicProfileDefaultValue],
};
