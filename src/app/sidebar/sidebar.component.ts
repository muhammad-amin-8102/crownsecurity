import { Component, OnInit, Host } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  router: Router;
  appComponent: AppComponent;
  constructor(
    private _router: Router,
    @Host() private _appComponent: AppComponent) { 
      this.router = this._router;
      this.appComponent = this._appComponent;
    }

  ngOnInit() {
  }

}
