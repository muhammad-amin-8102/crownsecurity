import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from '@app/constants';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {
  cols: Array<any> = [];
  constructor() { }

  ngOnInit() {
    this.cols = CONSTANTS.viewReportColumns;
  }

}
