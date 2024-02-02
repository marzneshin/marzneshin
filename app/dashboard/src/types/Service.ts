
export type Service = {
    id: number;
    name: string;
    users: number[];
    inbounds: number[];
}

export type CreateService = Pick<Service,
    | 'name'
    | 'users'
    | 'inbounds'>
