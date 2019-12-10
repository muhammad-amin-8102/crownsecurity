import { Component, OnInit, Host } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Site } from '@app/_models/site';
import { SiteService } from '@app/_services/site.service';
import { User } from '@app/_models/user';
import { head } from 'lodash';

interface City {
  name: string;
  code: string;
}

@Component({
	selector: 'app-call-reporting',
	templateUrl: './call-reporting.component.html',
	styleUrls: ['./call-reporting.component.scss']
})
export class CallReportingComponent implements OnInit {
	sites: Array<Site>;
	selectedSite: Site;
	usersReporting: Array<User>;

	constructor(@Host() private appComponent: AppComponent,
	private siteService: SiteService) { }

	ngOnInit() {
		this.appComponent.pageTitle = 'Call Reporting';
		this.getSites();
	}

	getSites() {
		this.siteService.getAll().subscribe(data => {
			this.sites = data;
		});
	}

	changeSite() {
		this.populateReportingGrid();
	}

	populateReportingGrid() {
		const latestSiteStrength = head(this.selectedSite.site_strengths);
		if (latestSiteStrength) {
			
		}
	}
}
