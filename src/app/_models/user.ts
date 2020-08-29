import { Role, UserRole } from "./role";
import { Site } from './site';

export class User {
	id: number = null;
	role_id: number = null;
	code: string = '';
	firstname: string = '';
	middlename: string = '';
	lastname: string = '';
	displayname: string = '';
	email: string = '';
	corp_email: string = '';
	dob: string = '';
	dobDate: Date = null;
	gender: any = '';
	genderObj: any = null;
	address: string = '';
	pan: string = '';
	adhaar: string = '';
	adhaar_name: string = '';
	bank_id: number = null;
	password: string = '';
	verified: boolean = false;
	contact_number: string = '';
	alternate_contact_number: string = '';
	active: boolean = true;
	linked_site_code: string = '';
	start_date: string = '';
	startDateObj: Date = null;
	end_date: string = '';
	endDateObj: Date = null;
	site: Site = null;
	role: UserRole = null;
	userRole: UserRole = null;
	token?: string = '';
	userAudits: Array<UserAudit> = [];
	createdAt: Date = new Date();
	updateAt: Date = new Date();
	edit: boolean = false;
}

export class UserAudit {
	id: number;
	user_id: number;
	site_id: number;
	attendance: boolean;
	ot: boolean;
	cross_ot: boolean;
	night_day_ot: boolean;
	night_day_cross_ot: boolean;
	grooming_failure: boolean;
	beard: boolean;
	uniform: boolean;
	shoes: boolean;
	socks: boolean;
	accessories: boolean;
	hair_cut: boolean;
	idf: boolean;
	comments: string;
	adhoc: boolean;
	shift: number;
	createdAt: Date;
	updateAt: Date;
}