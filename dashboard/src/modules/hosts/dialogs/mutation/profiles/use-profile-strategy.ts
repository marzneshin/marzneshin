import { ProtocolType } from "@marzneshin/modules/inbounds";
import { GeneralSchema, GeneralProfileFields } from "./general";
import { WireguardSchema, WireguardProfileFields } from "./wireguard";
import { Hysteria2Schema, Hysteria2ProfileFields } from "./hysteria2";
import { TuicSchema, TuicProfileFields } from "./tuic";

export const useProfileStrategy = (profile: ProtocolType) => {
    return {
        vless: [GeneralSchema, GeneralProfileFields],
        vmess: [GeneralSchema, GeneralProfileFields],
        trojan: [GeneralSchema, GeneralProfileFields],
        shadowsocks: [GeneralSchema, GeneralProfileFields],
        shadowsocks2022: [GeneralSchema, GeneralProfileFields],
        wireguard: [WireguardSchema, WireguardProfileFields],
        hysteria2: [Hysteria2Schema, Hysteria2ProfileFields],
        tuic: [TuicSchema, TuicProfileFields],
    }[profile];
}
