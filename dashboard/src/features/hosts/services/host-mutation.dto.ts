import { HostType } from "@marzneshin/features/hosts";

export interface HostRequestDto {
    inboundId: number
    host: HostType
}

export interface HostUpdateRequestDto {
    hostId: number
    host: HostType
}
