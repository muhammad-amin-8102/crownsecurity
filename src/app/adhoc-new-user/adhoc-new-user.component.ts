import { Component, OnInit, Host, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdhocService } from '@app/_services/adhoc.service';
import { AdhocNewUser } from '@app/_models/adhoc';
import { CONSTANTS } from '@app/constants';
import { RoleService } from '@app/_services/role.service';
import { UserRole } from '@app/_models/role';
import { head, cloneDeep, pick } from 'lodash';
import { format, isWithinInterval } from 'date-fns';
import { FilterUtils, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
	selector: 'app-adhoc-new-user',
	templateUrl: './adhoc-new-user.component.html',
	styleUrls: ['./adhoc-new-user.component.scss']
})
export class AdhocNewUserComponent implements OnInit, OnDestroy {
	public adhocNewUsers: Array<AdhocNewUser> = [];
	public adhocNewUsersVirtual: Array<AdhocNewUser> = [];
	roles: Array<UserRole> = [];
	public adhochNewUsersCols = CONSTANTS.adhocNewUsersCols;
	public genders = [
		{
			name: 'Male'
		},
		{
			name: 'Female'
		}
	];
	@ViewChild('dt', { static: true }) table: Table;
	public fromDate: string = null;
	public toDate: string = null;
	public filterActive: boolean = true;

	constructor(@Host() private appComponent: AppComponent,
		private adhocService: AdhocService,
		private roleService: RoleService) { }

	ngOnInit() {
		this.appComponent.pageTitle = 'Adhoc New Users';
		this.adhocNewUsersVirtual = Array.from({length: 10000});
		this.getAllUsers();
		this.getRoles();
		//custome filters
		FilterUtils['role_dropdown_filter'] = (value, filter): boolean => {
			if (filter === undefined || filter === null || filter.trim() === '') {
                return true;
            }
    
            if (value === undefined || value === null) {
                return false;
			}
			
			return String(value.name).toLowerCase().indexOf(filter) > -1;
		}

		FilterUtils['dob_filter'] = (value, filter): boolean => {
			if (filter.length && new Date(filter[0]) < new Date(filter[1])) {
				return isWithinInterval(new Date(value), {
					start: new Date(filter[0]),
					end: new Date(filter[1])
				});
			}
			return false;
		}
		
		FilterUtils['gender_filter'] = (value, filter): boolean => {
			return String(value.name).toLowerCase().includes(String(filter).toLowerCase());
		}
	}

	
	getRoles() {
		this.roleService.getAll().subscribe(data => {
			this.roles = data;
		});
	}

	getAllUsers() {
		this.adhocService.getAllAdhocNewUsers().subscribe(data => {
			this.adhocNewUsers = data.map(x => this.getAdhocNewUserRowObject(x));
		});
	}

	loadLazy(event: LazyLoadEvent) {  
		//load data of required page
		let loadedUsers = this.adhocNewUsers.slice(event.first, (event.first + event.rows));

		//populate page of virtual cars
		Array.prototype.splice.apply(this.adhocNewUsersVirtual, [...[event.first, event.rows], ...loadedUsers]);
		
		//trigger change detection
		this.adhocNewUsersVirtual = [...this.adhocNewUsersVirtual];
    }

	getAdhocNewUserRowObject(user = null): AdhocNewUser {
		return {
			id: user ? user.id : null,
			role_id: user ? user.role.id : null,
			role: user ? user.role : {name: ''},
			code: user ? user.code : '',
			firstname: user ? user.firstname : '',
			middlename: user ? user.middlename : '',
			lastname: user ? user.lastname : '',
			dob: user ? format(new Date(user.dob), 'yyyy-MM-dd') : null,
			gender: user ? this.selectGenderObject(user.gender) : '',
			address: user ? user.address : '',
			pan: user ? user.pan : '',
			adhaar: user ? user.adhaar : '',
			verified: user ? user.verified : false,
			contact_number: user ? user.contact_number : '',
			alternate_contact_number: user ? user.alternate_contact_number : '',
			active: user ? user.active : true,
			edit: false,
			previous_state: null
		};
	}

	dobRangeFilter(value, rangeType) {
		if (this.fromDate && this.toDate) {
			return this.table.filter([this.fromDate, this.toDate], 'dob', 'dob_filter');
		}
		return false;
	}

	selectGenderObject(stringGender: string) {
		return this.genders.find(x => x.name === stringGender);
	}

	addAdhocNewUser() {
		this.adhocNewUsers.push(this.getAdhocNewUserRowObject());
	}

	onRowEdit(rowData: AdhocNewUser) {
		rowData.previous_state = cloneDeep(rowData);
		rowData.previous_state.previous_state = null;
		rowData.edit = true;
	}

	onRowDelete(rowData: AdhocNewUser) {
		if (rowData.id) {
			this.adhocService.deleteUser(pick(rowData, CONSTANTS.adhocNewUserDeleteRequestProps)).subscribe(
				(res: any) => {
					this.adhocNewUsers.splice(this.adhocNewUsers.findIndex(x => x === rowData), 1);
				}
			)
		}
	}

	onRowUpsert(rowData: AdhocNewUser) {
		rowData.role_id = rowData.role.id;
		rowData.gender = rowData.gender.name;
		rowData.dob = format(new Date(rowData.dob.toLocaleDateString()), 'yyyy-MM-dd');
		if (!rowData.id) {
			//create user
			this.adhocService.createUser(pick(rowData, CONSTANTS.adhocNewUserCreateRequestProps)).subscribe(
				(res: any) => {
					rowData.previous_state = null;
					rowData.edit = false;
				}
			)
		} else {
			//update user
			this.adhocService.updateUser(pick(rowData, CONSTANTS.adhocNewUserUpdateRequestProps)).subscribe(
				(res: any) => {
					rowData.previous_state = null;
					rowData.edit = false;
				}
			)
		}
		
	}

	onRowCancel(rowData: AdhocNewUser) {
		const previousStateObject = this.getAdhocNewUserRowObject(cloneDeep(rowData.previous_state));
		const delsertIndex = this.adhocNewUsers.findIndex(x => x === rowData);
		rowData.edit = false;
		this.adhocNewUsers.splice(delsertIndex, 1);// delting edited object
		this.adhocNewUsers.splice(delsertIndex, 0, previousStateObject); // adding previous object on same index
	}

	onChangeRole(rowData: AdhocNewUser) {
	}

	onChangeGender(rowData: AdhocNewUser) {
	}

	onDateRangeRefresh() {
		this.fromDate = this.toDate = null;
		return this.table.filter([], 'dob', 'dob_filter');
	}

	ngOnDestroy() {
	}
}
