import { Component, OnInit, Host, OnDestroy } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Site, SiteStrength } from '@app/_models/site';
import { SiteService } from '@app/_services/site.service';
import { UserAuditReportService } from '@app/_services/user-audit-report.service';
import { User } from '@app/_models/user';
import { head, range } from 'lodash';
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
			{ field: 'role', header: 'Role', width: '200px'},
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
			reportingDate:  new FormControl(this.reportingDate || '', Validators.required),
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
				}).subscribe((data: Array<any>) => {
					if (data.length) {
						
					} else {
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

	populateReportingGrid() {
		this.usersReporting = [];
		const latestSiteStrength: SiteStrength = head(this.selectedSite.site_strengths);
		if (latestSiteStrength && latestSiteStrength.strength_count) {
			range(1, latestSiteStrength.strength_count + 1).forEach(e => {
				const callReportingGridObject: CallReportingGrid = {
					role: 0,
					name: '',
					user_id: 0,
					ot: false,
					cross_ot: false,
					grooming_failure: false,
					attendance: false,
					beard: false,
					uniform: false,
					shoes: false,
					socks: false,
					accessories: false,
					hair_cut: false,
					idf: false,
					comments: '',
					adhoc: false
				}; 
				this.usersReporting.push(callReportingGridObject);
			});
		}
	}

	changeRole(rowData: any) {
		this.userService.getByRole(rowData.role.id).subscribe((data: Array<any>) => {
			rowData.users = data;
		});
	}

	changeName(rowData: any) {
		this.setUserData(rowData);
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
}
