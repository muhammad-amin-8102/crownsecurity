import { Component, OnInit, Host, OnDestroy } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Site } from '@app/_models/site';
import { UserAuditReportService } from '@app/_services/user-audit-report.service';
import { head, range, pick, cloneDeep, differenceBy } from 'lodash';
import { UserRole } from '@app/_models';
import { UserService } from '@app/_services/user.service';
import { CallReportingGrid } from '@app/_models/call-reporting';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CONSTANTS } from '@app/constants';
import { startOfToday } from 'date-fns';
import { User } from '@app/_models/user';
import { AdhocService } from '@app/_services/adhoc.service';
import { AdhocType } from '@app/_models/adhoc';
import { SharedService } from '@app/shared.service';

@Component({
	selector: 'app-call-reporting',
	templateUrl: './call-reporting.component.html',
	styleUrls: ['./call-reporting.component.scss']
})
export class CallReportingComponent implements OnInit, OnDestroy {
	sites: Array<Site>;
	selectedSite: Site;
	usersReporting: Array<CallReportingGrid> = [];
	adhocReporting: Array<CallReportingGrid> = [];
	shifts: Array<{
		name: string;
		value: number;
		strength_count: number;
	}> = [];
	selectedShift: {
		name: number;
		value: number;
		strength_count: number;
	};
	roles: Array<UserRole> = [];
	cols: any[];
	frozenCols: any[];
	reportingDate: Date = null;
	maxDate: Date;
	reportSearchForm: FormGroup;
	reportSearchFormSubscriber: any;
	currentReport: any;
	disableReportGrid: boolean;
	showEdit: boolean;
	adhocCols: any;
	users: Array<User> = [];
	selectedUsers: Array<any> = [];
	unselectedUsers: Array<any> = [];
	adhocTypes: Array<AdhocType>;

	constructor(@Host() private appComponent: AppComponent,
		private sharedService: SharedService,
		private userAuditReportService: UserAuditReportService,
		private userService: UserService,
		private fb: FormBuilder,
		private messageService: MessageService,
		private adhocService: AdhocService) { }

	ngOnInit() {
		this.appComponent.pageTitle = 'Call Reporting';
		this.roles = this.sharedService.roles;
		this.sites = this.sharedService.sites;
		this.users = this.sharedService.users;
		this.sharedService.broadcastAllData.subscribe(allData => {
		if (allData) {
			[this.roles, this.sites, this.users] = allData;
		}
		});
		this.cols = CONSTANTS.callReportingColumns;
		this.adhocCols = CONSTANTS.callReportingAdhocColumns;
		this.frozenCols = [
			{ field: 'name', header: 'Name' }
		];
		this.maxDate = new Date();
		this.initFormGroup();
	}

	initFormGroup() {
		this.reportSearchForm = this.fb.group({
			reportingDate: new FormControl(this.reportingDate || '', Validators.required),
			selectedSite: new FormControl(this.selectedSite || '', Validators.required),
			selectedShift: new FormControl(this.selectedShift || '', Validators.required)
		});
		this.reportSearchFormSubscriber = this.reportSearchForm.valueChanges.subscribe(data => {
			this.reportingDate = data.reportingDate;
			this.selectedSite = data.selectedSite;
			this.selectedShift = data.selectedShift;
			if (this.reportSearchForm.valid) {
				this.userAuditReportService.getByParams({
					userTodayDate: startOfToday().toLocaleDateString(),
					reportingDate: this.reportingDate.toLocaleDateString(),
					siteId: this.selectedSite.id,
					shift: this.selectedShift.value
				}).subscribe((data: any) => {
					if (data.userAuditReport) {
						this.currentReport = data.userAuditReport;
						this.disableReportGrid = data.disableForm;
						this.showEdit = data.showEdit;
						this.populateReportingGrid(true);
						this.updateSelectedUsers();
					} else {
						this.currentReport = {};
						this.disableReportGrid = data.disableForm;
						this.showEdit = data.showEdit;
						this.populateReportingGrid();
						this.updateSelectedUsers();
					}
					this.cols[0].show = !this.disableReportGrid;
					this.adhocCols[0].show = !this.disableReportGrid;
				});
			} else {
				this.usersReporting = [];
			}
		});
	}

	getAdhocTypes() {
		this.adhocService.getAll().subscribe(data => {
			this.adhocTypes = data;
		});
	}

	changeSite() {
		if (this.selectedSite) {
			this.shifts = [];

			const site_strength = head(this.selectedSite.site_strengths);
			for (let i = 1; i <= 3; i++) {
				const shiftType = i === 1 ? 'day' : i === 2 ? 'general' : 'night';
				this.shifts.push({
					name: shiftType,
					value: i,
					strength_count: site_strength['strength_count_' + shiftType]
				});
			}
		} else {
			this.shifts = [];
		}
	}

	changeShift() {

	}

	populateReportingGrid(dataPresent: boolean = false) {
		this.usersReporting = [];
		this.adhocReporting = [];
		if (dataPresent) {
			this.currentReport.user_audits.forEach(report => {
				const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject(report);
				this.addDisplayNameToUser(callReportingGridObject);
				this.changeRole(callReportingGridObject);
				if (report.adhoc) {
					this.changeAssignedRole(callReportingGridObject);
					this.adhocReporting.push(callReportingGridObject);
				} else {
					this.usersReporting.push(callReportingGridObject);
				}
			});
			if (this.selectedShift.strength_count
				&& this.usersReporting.length < this.selectedShift.strength_count) {
				range(1, this.selectedShift.strength_count - this.usersReporting.length + 1).forEach(e => {
					const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject();
					this.addDisplayNameToUser(callReportingGridObject);
					this.usersReporting.push(callReportingGridObject);
				});
			}
		} else {
			if (this.selectedShift.strength_count) {
				range(1, this.selectedShift.strength_count + 1).forEach(e => {
					const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject();
					this.addDisplayNameToUser(callReportingGridObject);
					this.usersReporting.push(callReportingGridObject);
				});
			}
		}
	}

	addDisplayNameToUser(callReportingGridObject) {
		if (callReportingGridObject.user) {
			callReportingGridObject.user.displayname = callReportingGridObject.user.firstname + ' ' + callReportingGridObject.user.lastname;
		}
	}

	getCallReportingRowObject(report = null): CallReportingGrid {
		return {
			role: report ? head(this.roles.filter(x => x.id === +report.user.role_id)) : null,
			assigned_role: report ? head(this.roles.filter(x => x.id === +report.assigned_role_id)) : null,
			assigned_role_id: report ? +report.assigned_role_id : null,
			name: report ? report.user : '',
			user_id: report ? +report.user.id : 0,
			ot: report ? report.ot : false,
			cross_ot: report ? report.cross_ot : false,
			night_day_ot: report ? report.night_day_ot : false,
			night_day_cross_ot: report ? report.night_day_cross_ot : false,
			grooming_failure: report ? report.grooming_failure : false,
			attendance: report ? report.attendance : false,
			beard: report ? report.beard : true,
			uniform: report ? report.uniform : true,
			shoes: report ? report.shoes : true,
			socks: report ? report.socks : true,
			accessories: report ? report.accessories : true,
			hair_cut: report ? report.hair_cut : true,
			idf: report ? report.idf : false,
			comments: report ? report.comments : '',
			adhoc: report ? report.adhoc : false,
			user: report ? report.user : null,
			users: report ? report.users : []
		};
	}

	setAttendance(rowData: any) {
			this.setGroomingFailure(rowData);
	}

	setGroomingFailure(rowData: any) {
		if (rowData.attendance) {
			rowData.grooming_failure = !(rowData.attendance && rowData.beard && rowData.uniform && rowData.shoes
				&& rowData.socks && rowData.accessories && rowData.hair_cut);
		} else {
			rowData.grooming_failure = 0;
		}
	}

	changeRole(rowData: any) {
		if (this.users.length) {
			rowData.users = differenceBy(this.users.filter(x => +x.role_id === +rowData.role.id), this.selectedUsers, 'id');
		}
		if (rowData.adhoc) {
		}
	}

	changeAssignedRole (rowData: any) {
		rowData.assigned_role_id = rowData.assigned_role.id;
	}

	changeName(rowData: any) {
		this.setUserData(rowData);
	}

	changeUserId(rowData: any) {
		this.setUserData(rowData);
	}

	setUserData(rowData: any) {
		this.userService.getCrossOtByUserId({
			reportingDate: this.reportingDate.toLocaleDateString(),
			siteId: this.selectedSite.id,
			shift: this.selectedShift.value,
			user_id: rowData.user.id
		}).subscribe((data: any) => {
			rowData.name = rowData.user.name;
			rowData.user_id = rowData.user.id;
			rowData.ot = data.ot > 0;
			rowData.cross_ot = data.cross_ot > 0;
			rowData.night_day_ot = data.night_day_ot > 0;
			rowData.night_day_cross_ot = data.night_day_cross_ot > 0;
			this.updateSelectedUsers();
			if (data.cross_ot_not_possible !== 0) {
				this.messageService.add(CONSTANTS.invalidCrossSiteSameShiftError);
				/** below lines to be used to restrict user to input users which are doing cross ot in same shift*/
				// this.onRowReset(rowData);
			}
			this.setGroomingFailure(rowData);
		});
	}

	onRowReset(rowData: any, adhoc = false) {
		const reportReference = adhoc ? this.adhocReporting : this.usersReporting;
		const removeSelectionIndex = reportReference.findIndex(x => x.user_id === rowData.user_id);
		reportReference.splice(removeSelectionIndex, 1);
		const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject();
		this.addDisplayNameToUser(callReportingGridObject);
		reportReference.splice(removeSelectionIndex, 0, callReportingGridObject);
		this.updateSelectedUsers();
	}

	onRowDelete(rowData: any, adhoc = false) {
		const reportReference = adhoc ? this.adhocReporting : this.usersReporting;
		const removeSelectionIndex = reportReference.findIndex(x => x.user_id === rowData.user_id);
		reportReference.splice(removeSelectionIndex, 1);
		this.updateSelectedUsers();
	}

	updateSelectedUsers() {
		this.selectedUsers = [...this.usersReporting.filter(x => x.user_id).map(x => x.user),
			...this.adhocReporting.filter(x => x.user_id).map(x => x.user)];
		this.updateGridUsersList();
	}

	updateGridUsersList() {
		this.usersReporting.forEach(x => {
			if (x.user) {
				x.users = [x.user, ...differenceBy(this.users.filter(y => +y.role_id === +x.role.id), this.selectedUsers, 'id')];
			}
		});
		this.adhocReporting.forEach(x => {
			if (x.user) {
				x.users = [x.user, ...differenceBy(this.users.filter(y => +y.role_id === +x.role.id), this.selectedUsers, 'id')];
			}
		});
	}

	ngOnDestroy() {
		this.reportSearchFormSubscriber.unsubscribe();
	}

	submitReport() {
		const auditReportObject = {
			reportingDate: this.reportingDate.toLocaleDateString(),
			siteId: this.selectedSite.id,
			shift: this.selectedShift.value,
			user_audits: [
				...this.usersReporting.map(x => pick(x, CONSTANTS.auditRequestProps)).filter(x => x.user_id),
				...this.adhocReporting.map(x => pick(x, CONSTANTS.auditAdhocRequestProps)).filter(x => x.user_id)
			]
		};
		if (this.currentReport && this.currentReport.id) {
			auditReportObject['userAuditReportId'] = this.currentReport.id;
		}
		this.userAuditReportService.createReport(auditReportObject).subscribe(data => {
			this.currentReport = data;
		});
	}

	editReport() {
		this.showEdit = false;
		this.disableReportGrid = false;
		this.cols[0].show = !this.disableReportGrid;
		this.adhocCols[0].show = !this.disableReportGrid;
	}

	addAdhoc() {
		const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject();
		callReportingGridObject.adhoc = true;
		this.addDisplayNameToUser(callReportingGridObject);
		this.adhocReporting.push(callReportingGridObject);
	}

	disableSave() {
		let filledUsers = [];
		filledUsers = [...this.usersReporting.filter(x => x.user_id), ...filledUsers];
		filledUsers = [...this.adhocReporting.filter(x => x.user_id), ...filledUsers];
		return !filledUsers.length;
	}
}
