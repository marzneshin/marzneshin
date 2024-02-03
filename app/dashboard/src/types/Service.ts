
export type Service = {
    id: number;
    name: string;
    users: number[];
    inbounds: number[];
}

export type ServiceCreate = Pick<Service,
    | 'name'
    | 'inbounds'>
