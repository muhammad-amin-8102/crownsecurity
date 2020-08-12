export class Site {
	id: number;
	name: string;
	site_code: string;
	billing_name: string;
	gst_number: string;
	address: string;
	contact_number: string;
	contact_person_name: string;
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
	strength_count_day: number;
	strength_count_general: number;
	strength_count_night: number;
	createdAt: Date;
	updatedAt: Date;
}