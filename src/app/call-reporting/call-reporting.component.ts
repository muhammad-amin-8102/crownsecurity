import { Component, OnInit, Host } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Site, SiteStrength } from '@app/_models/site';
import { SiteService } from '@app/_services/site.service';
import { User } from '@app/_models/user';
import { head, range } from 'lodash';
import { UserRole } from '@app/_models';
import { RoleService } from '@app/_services/role.service';
import { CallReportingGrid } from '@app/_models/call-reporting';

@Component({
	selector: 'app-call-reporting',
	templateUrl: './call-reporting.component.html',
	styleUrls: ['./call-reporting.component.scss']
})
export class CallReportingComponent implements OnInit {
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

	constructor(@Host() private appComponent: AppComponent,
		private siteService: SiteService,
		private roleService: RoleService) { }

	ngOnInit() {
		this.appComponent.pageTitle = 'Call Reporting';
		this.getSites();
		this.getRoles();
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
		if (this.selectedSite) {
			this.populateReportingGrid();
		} else {
			this.usersReporting = [];
		}
	}

	populateReportingGrid() {
		const latestSiteStrength: SiteStrength = head(this.selectedSite.site_strengths);
		if (latestSiteStrength && latestSiteStrength.strength_count) {
			range(1, latestSiteStrength.strength_count + 1).forEach(e => {
				const callReportingGridObject: CallReportingGrid = {
					selectedRole: {} as UserRole
				}; 
				this.usersReporting.push(callReportingGridObject);
			});
		}
	}
}
