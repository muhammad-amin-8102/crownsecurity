import { Component, OnInit } from '@angular/core';
import { Site } from '@app/_models/site';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {
  sites: Array<Site>;
  constructor() { }

  ngOnInit() {
  }

}
