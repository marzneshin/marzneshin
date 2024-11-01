import { ProtocolType } from "@marzneshin/modules/inbounds";
import { GeneralSchema, GeneralProfileFields, generalProfileDefaultValue } from "./general";
import { WireguardSchema, WireguardProfileFields, wireguardProfileDefaultValue } from "./wireguard";
import { Hysteria2Schema, Hysteria2ProfileFields, hysteria2ProfileDefaultValue } from "./hysteria2";
import { TuicSchema, TuicProfileFields, tuicProfileDefaultValue } from "./tuic";

export const useProfileStrategy = (profile: ProtocolType) => {
    return {
        vless: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        vmess: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        trojan: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        shadowsocks: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        shadowsocks2022: [GeneralSchema, GeneralProfileFields, generalProfileDefaultValue],
        wireguard: [WireguardSchema, WireguardProfileFields, wireguardProfileDefaultValue],
        hysteria2: [Hysteria2Schema, Hysteria2ProfileFields, hysteria2ProfileDefaultValue],
        tuic: [TuicSchema, TuicProfileFields, tuicProfileDefaultValue],
    }[profile];
}
