import { ProtocolType } from "@marzneshin/modules/inbounds";
import { generalProfile, profileByProtocol, ProfileConfig } from "./profiles";

/**
 * @param {ProtocolType} protocol - Inbound protocol of host
 * @returns {ProfileConfig} config - An array of schema, profile fields, and their default
 * @default *General Profile* if no protocol is specified
 */
export const useProfileStrategy = (protocol?: ProtocolType): ProfileConfig => {
    return protocol && profileByProtocol[protocol]
        ? profileByProtocol[protocol]
        : generalProfile;
};
