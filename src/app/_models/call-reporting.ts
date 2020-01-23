import { UserRole } from './role';

export interface CallReportingGrid {
	role: UserRole;
	assigned_role: UserRole;
	name: string;
	user_id: number;
	ot: boolean;
	cross_ot: boolean;
	grooming_failure: boolean;
	attendance: boolean;
	beard: boolean;
	uniform: boolean;
	shoes: boolean;
	socks: boolean;
	accessories: boolean;
	hair_cut: boolean;
	idf: boolean;
	comments: string;
	adhoc: boolean;
	user: any;
	users: any[];
}