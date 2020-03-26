export class Site {
	id: number;
	name: string;
	code: string;
	branch_name: string;
	location: string;
	zone: string;
	address: string;
	contact: string;
	contact_person: string;
	active: boolean;
	shift: number;
	site_strengths: Array<SiteStrength>;
	createdAt: Date;
	updatedAt: Date;
}

export class SiteStrength {
	id: number;
	requirement_date: Date;
	site_id: number;
	strength_count: number;
	shift: number;
	createdAt: Date;
	updatedAt: Date;
}