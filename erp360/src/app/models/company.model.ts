export interface Company {
    id?: string;
    name: string;
    nit: string;
    ownerUID?: string;
    createdAt?: Date;

    ownerData?: {
        displayName: string;
        email?: string;
    };
}
