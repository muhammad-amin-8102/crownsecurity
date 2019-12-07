import { Component, OnInit, Host } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private router: Router,
    @Host() private appComponent: AppComponent) { }

  ngOnInit() {
  }

}
