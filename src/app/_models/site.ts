export class Site {
    id: number;
    name: string;
    address: string;
    contact: string;
    contact_person: string;
    active: boolean;
    site_strengths: Array<SiteStrength>;
    createdAt: Date;
    updatedAt: Date;
}

export class SiteStrength {
    id: number;
    requirement_date: Date;
    site_id: number;
    strength_count: number;
    createdAt: Date;
    updatedAt: Date;
}