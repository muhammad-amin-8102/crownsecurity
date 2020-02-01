import { Role, UserRole } from "./role";

export class User {
	id: number;
	role_id: number;
	code: string;
	firstname: string;
	middlename: string;
	lastname: string;
	email: string;
	corp_email: string;
	dob: Date;
	gender: string;
	address: string;
	pan: string;
	adhaar: string;
	bank_id: number;
	password: string;
	verified: boolean;
	contact_number: number;
	active: boolean;
	role: Role;
	userRole: UserRole;
	token?: string;
	userAudits: Array<UserAudit>;
	createdAt: Date;
	updateAt: Date;
}

export class UserAudit {
	id: number;
	user_id: number;
	site_id: number;
	attendance: boolean;
	ot: boolean;
	cross_ot: boolean;
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