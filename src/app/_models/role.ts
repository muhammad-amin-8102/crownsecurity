export enum Role {
	CallReporter = 'CALL_REPORTER',
	Admin = 'Admin'
}

export class UserRole {
	id: number;
	name: string;
	label: string;
	createdAt: Date;
	updatedAt: Date;
}