import { HostType } from "@marzneshin/modules/hosts";

export interface HostRequestDto {
    inboundId: number
    host: HostType
}

export interface HostUpdateRequestDto {
    hostId: number
    host: HostType
}
