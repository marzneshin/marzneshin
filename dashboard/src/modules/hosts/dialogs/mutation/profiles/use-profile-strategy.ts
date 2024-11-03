import { ProtocolType } from "@marzneshin/modules/inbounds";
import { FC } from "react";
import { GeneralSchema, GeneralProfileFields, generalProfileDefaultValue } from "./general";
import { WireguardSchema, WireguardProfileFields, wireguardProfileDefaultValue } from "./wireguard";
import { Hysteria2Schema, Hysteria2ProfileFields, hysteria2ProfileDefaultValue } from "./hysteria2";
import { TuicSchema, TuicProfileFields, tuicProfileDefaultValue } from "./tuic";

type ProfileSchema = typeof GeneralSchema | typeof WireguardSchema | typeof Hysteria2Schema | typeof TuicSchema;
type ProfileFields = FC;

/**
 * @param protocol - Inbound protocol of host
 * @returns [schema, fields, default values] - An array of schema, profile fields, and their default
 */
export const useProfileStrategy = (
    protocol?: ProtocolType
): [ProfileSchema, ProfileFields, object] => {
    if (!protocol)
        return [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue]

    const profileMap: { [key in ProtocolType]: [ProfileSchema, ProfileFields, object] } = {
        vless: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        vmess: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        trojan: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        shadowsocks: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        shadowsocks2022: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        wireguard: [WireguardSchema, WireguardProfileFields, wireguardProfileDefaultValue],
        hysteria2: [Hysteria2Schema, Hysteria2ProfileFields, hysteria2ProfileDefaultValue],
        tuic: [TuicSchema, TuicProfileFields, tuicProfileDefaultValue],
    };

    const [Schema, Fields, defaultValues] = profileMap[protocol] || [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue];
    return [Schema, Fields, defaultValues];
};
