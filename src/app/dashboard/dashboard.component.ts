import { Component, OnInit, Host } from '@angular/core';
import { AppComponent } from '@app/app.component';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	constructor(@Host() private appComponent: AppComponent) { }

	ngOnInit() {
		this.appComponent.pageTitle = 'Dashboard';
	}

}
