import { Role, UserRole } from './role';
import { UserAudit } from './user';

export class AdhocNewUser {
	id: number;
	role_id: number;
	code: string;
	firstname: string;
	middlename: string;
	lastname: string;
	dob: any;
	gender: any;
	address: string;
	pan: string;
	adhaar: string;
	verified: boolean;
	contact_number: number;
	alternate_contact_number: number;
	active: boolean;
	role: UserRole;
	edit: boolean = false;
	previous_state: any;
}

export class AdhocType {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}