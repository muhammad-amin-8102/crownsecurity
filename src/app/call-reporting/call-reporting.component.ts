import { Component, OnInit, Host } from '@angular/core';
import { AppComponent } from '@app/app.component';

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
	cities1: Array<any>;
	selectedCity1: City;

	constructor(@Host() private appComponent: AppComponent) { }

	ngOnInit() {
		this.appComponent.pageTitle = 'Call Reporting';
		this.cities1 = [
			{label:'Select City', value:null},
			{label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
			{label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
			{label:'London', value:{id:3, name: 'London', code: 'LDN'}},
			{label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
			{label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
	];
	}

}
