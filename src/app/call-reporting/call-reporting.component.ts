import { Component, OnInit, Host, OnDestroy } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Site, SiteStrength } from '@app/_models/site';
import { SiteService } from '@app/_services/site.service';
import { UserAuditReportService } from '@app/_services/user-audit-report.service';
import { head, range, pick, cloneDeep } from 'lodash';
import { UserRole } from '@app/_models';
import { RoleService } from '@app/_services/role.service';
import { UserService } from '@app/_services/user.service';
import { CallReportingGrid } from '@app/_models/call-reporting';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CONSTANTS } from '@app/constants';
import { startOfToday } from 'date-fns';

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
		name: number;
		value: number;
	}> = [];
	selectedShift: {
		name: number;
		value: number;
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
	adhocCols: any;

	constructor(@Host() private appComponent: AppComponent,
		private siteService: SiteService,
		private roleService: RoleService,
		private userAuditReportService: UserAuditReportService,
		private userService: UserService,
		private fb: FormBuilder,
		private messageService: MessageService) { }

	ngOnInit() {
		this.appComponent.pageTitle = 'Call Reporting';
		this.getSites();
		this.getRoles();
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
					userTodayDate: startOfToday().toISOString(),
					reportingDate: this.reportingDate,
					siteId: this.selectedSite.id,
					shift: this.selectedShift.value
				}).subscribe((data: any) => {
					if (data.userAuditReport) {
						this.currentReport = data.userAuditReport;
						this.disableReportGrid = data.disableForm;
						this.populateReportingGrid(true);
					} else {
						this.disableReportGrid = data.disableForm;
						this.populateReportingGrid();
					}
					this.cols[0].show = !this.disableReportGrid;
					this.adhocCols[0].show = !this.disableReportGrid;
				});
			} else {
				this.usersReporting = [];
			}
		});
	}

	getSites() {
		this.siteService.getAll().subscribe(data => {
			this.sites = data;
		});
	}

	getRoles() {
		this.roleService.getAll().subscribe(data => {
			this.roles = data;
		});
	}

	changeSite() {
		if (this.selectedSite) {
			const shiftCount = this.selectedSite.shift;
			this.shifts = [];
			for (let i = 1; i <= shiftCount; i++) {
				this.shifts.push({
					name: i,
					value: i
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
		const latestSiteStrength: SiteStrength = head(this.selectedSite.site_strengths);
		if (dataPresent) {
			this.currentReport.user_audits.forEach(report => {
				const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject(report);
				if (report.adhoc) {
					this.adhocReporting.push(callReportingGridObject);
				} else {
					this.usersReporting.push(callReportingGridObject);
				}
			});
			if (!this.disableReportGrid && latestSiteStrength && latestSiteStrength.strength_count
				&& this.usersReporting.length < latestSiteStrength.strength_count) {
				range(1, latestSiteStrength.strength_count - this.usersReporting.length + 1).forEach(e => {
					const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject();
					this.usersReporting.push(callReportingGridObject);
				});
			}
		} else {
			if (latestSiteStrength && latestSiteStrength.strength_count) {
				range(1, latestSiteStrength.strength_count + 1).forEach(e => {
					const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject();
					this.usersReporting.push(callReportingGridObject);
				});
			}
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
			grooming_failure: report ? report.grooming_failure : false,
			attendance: report ? report.attendance : false,
			beard: report ? report.beard : false,
			uniform: report ? report.uniform : false,
			shoes: report ? report.shoes : false,
			socks: report ? report.socks : false,
			accessories: report ? report.accessories : false,
			hair_cut: report ? report.hair_cut : false,
			idf: report ? report.idf : false,
			comments: report ? report.comments : '',
			adhoc: report ? report.adhoc : false,
			user: report ? report.user : null,
			users: report ? [report.user] : []
		};
	}

	setGroomingFailure(rowData: any) {
		rowData.grooming_failure = !(rowData.attendance && rowData.beard && rowData.uniform && rowData.shoes
		&& rowData.socks && rowData.accessories && rowData.hair_cut);
	}

	changeRole(rowData: any) {
		this.userService.getByRole(rowData.role.id).subscribe((data: Array<any>) => {
			rowData.users = data;
			if (rowData.users) {
				rowData.users.forEach(x => {
					x.displayname = x.firstname + ' ' + x.lastname;
				});
			}
		});
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
			reportingDate: this.reportingDate,
			siteId: this.selectedSite.id,
			shift: this.selectedShift.value,
			user_id: rowData.user.id
		}).subscribe((data: any) => {
			if (data.cross_ot_not_possible === 0) {
				rowData.name = rowData.user.name;
				rowData.user_id = rowData.user.id;
			} else {
				this.messageService.add(CONSTANTS.invalidCrossSiteSameShiftError);
				/** below lines to be used to restrict user to input users which are doing cross ot in same shift*/
				// this.onRowReset(rowData);
			}
			rowData.ot = data.ot > 0;
			rowData.cross_ot = data.cross_ot > 0;
		});
	}

	onRowReset(rowData: any, adhoc = false) {
		const reportReference = adhoc ? this.adhocReporting : this.usersReporting;
		const removeSelectionIndex = reportReference.findIndex(x => x.user_id === rowData.user_id);
		reportReference.splice(removeSelectionIndex, 1);
		const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject();
		reportReference.splice(removeSelectionIndex, 0, callReportingGridObject);
	}

	onRowDelete(rowData: any, adhoc = false) {
		const reportReference = adhoc ? this.adhocReporting : this.usersReporting;
		const removeSelectionIndex = reportReference.findIndex(x => x.user_id === rowData.user_id);
		reportReference.splice(removeSelectionIndex, 1);
	}

	ngOnDestroy() {
		this.reportSearchFormSubscriber.unsubscribe();
	}

	submitReport() {
		const auditReportObject = {
			reportingDate: this.reportingDate,
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
		});
	}

	addAdhoc() {
		const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject();
		callReportingGridObject.adhoc = true;
		this.adhocReporting.push(callReportingGridObject);
	}

	disableSave() {
		let filledUsers = [];
		filledUsers = [...this.usersReporting.filter(x => x.user_id), ...filledUsers];
		filledUsers = [...this.adhocReporting.filter(x => x.user_id), ...filledUsers];
		return !filledUsers.length;
	}
}
