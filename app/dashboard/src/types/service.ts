
export type Service = {
    id: number;
    name: string;
    users: number[];
    inbounds: number[];
}

export type ServiceCreate = {
    id: number | undefined;
    name: string;
    inbounds: number[];
}
