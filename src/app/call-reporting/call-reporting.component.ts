import { Component, OnInit, Host, OnDestroy } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Site, SiteStrength } from '@app/_models/site';
import { SiteService } from '@app/_services/site.service';
import { UserAuditReportService } from '@app/_services/user-audit-report.service';
import { head, range, pick } from 'lodash';
import { UserRole } from '@app/_models';
import { RoleService } from '@app/_services/role.service';
import { UserService } from '@app/_services/user.service';
import { CallReportingGrid } from '@app/_models/call-reporting';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-call-reporting',
	templateUrl: './call-reporting.component.html',
	styleUrls: ['./call-reporting.component.scss']
})
export class CallReportingComponent implements OnInit, OnDestroy {
	sites: Array<Site>;
	selectedSite: Site;
	usersReporting: Array<CallReportingGrid> = [];
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

	constructor(@Host() private appComponent: AppComponent,
		private siteService: SiteService,
		private roleService: RoleService,
		private userAuditReportService: UserAuditReportService,
		private userService: UserService,
		private fb: FormBuilder) { }

	ngOnInit() {
		this.appComponent.pageTitle = 'Call Reporting';
		this.getSites();
		this.getRoles();
		this.cols = [
			{ field: 'role', header: 'Role', width: '200px' },
			{ field: 'name', header: 'Name', width: '200px' },
			{ field: 'user_id', header: 'User ID', width: '200px' },
			{ field: 'attendance', header: 'Attendance', width: '100px' },
			{ field: 'beard', header: 'Beard', width: '100px' },
			{ field: 'uniform', header: 'Uniform', width: '100px' },
			{ field: 'shoes', header: 'Shoes', width: '100px' },
			{ field: 'socks', header: 'Socks', width: '100px' },
			{ field: 'accessories', header: 'Accessories', width: '100px' },
			{ field: 'hair_cut', header: 'Haircut', width: '100px' },
			{ field: 'idf', header: 'ID Failure', width: '100px' },
			{ field: 'comments', header: 'Comments', width: '200px' }
		];
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
					reportingDate: this.reportingDate,
					siteId: this.selectedSite.id,
					shift: this.selectedShift.value
				}).subscribe((data: any) => {
					if (data.userAuditReport.length) {
						this.currentReport = head(data.userAuditReport);
						this.disableReportGrid = data.disableForm;
						this.populateReportingGrid(true);
					} else {
						this.disableReportGrid = data.disableForm;
						this.populateReportingGrid();
					}
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
		const latestSiteStrength: SiteStrength = head(this.selectedSite.site_strengths);
		if (dataPresent) {
			this.currentReport.user_audits.forEach(report => {
				const callReportingGridObject: CallReportingGrid = this.getCallReportingRowObject(report);
				this.usersReporting.push(callReportingGridObject);
			});
			if (latestSiteStrength && latestSiteStrength.strength_count
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
			name: report ? report.user : '',
			user_id: report ? report.user.id : 0,
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

	changeRole(rowData: any) {
		this.userService.getByRole(rowData.role.id).subscribe((data: Array<any>) => {
			rowData.users = data;
		});
	}

	changeName(rowData: any) {
		this.setUserData(rowData);
		console.log(rowData);
	}

	changeUserId(rowData: any) {
		this.setUserData(rowData);
	}

	setUserData(rowData: any) {
		rowData.name = rowData.user.name;
		rowData.user_id = rowData.user.id;
	}

	ngOnDestroy() {
		this.reportSearchFormSubscriber.unsubscribe();
	}

	submitReport() {
		const auditRequestProps = [
			'user_id',
			'attendance',
			'ot',
			'cross_ot',
			'grooming_failure',
			'beard',
			'uniform',
			'shoes',
			'socks',
			'accessories',
			'hair_cut',
			'idf',
			'comments',
			'adhoc'
		]
		const auditReportObject = {
			reportingDate: this.reportingDate,
			siteId: this.selectedSite.id,
			shift: this.selectedShift.value,
			user_audits: this.usersReporting.map(x => pick(x, auditRequestProps)).filter(x => x.user_id)
		};
		this.userAuditReportService.createReport(auditReportObject).subscribe(data => {
			console.log(data);
		});
	}
}
