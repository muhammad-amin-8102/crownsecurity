import { Injectable } from '@angular/core';
import { UserRole, User } from './_models';
import { RoleService } from './_services/role.service';
import { SiteService } from './_services/site.service';
import { UserService } from './_services';
import { Site } from './_models/site';
import { forkJoin, BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SharedService {
  roles: UserRole[] = [];
  sites: Site[] = [];
  users: User[] = [];
  broadcastAllData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private roleApi = this.roleService.getAll();
  private siteApi = this.siteService.getAll();
  private userApi = this.userService.getAll();

  constructor(
    private roleService: RoleService,
    private siteService: SiteService,
    private userService: UserService
  ) { }

  getAllData() {
    forkJoin([this.roleApi, this.siteApi, this.userApi]).subscribe(results => {
      [this.roles, this.sites, this.users] = results;
      this.users.forEach(x => {
        x.displayname = x.firstname + ' ' + x.lastname;
      });
      this.sites.forEach((x: any) => x.combined_name = x.name + ' (' + x.site_code + ')');
      this.broadcastData();
    });
  }

  broadcastData() {
    this.broadcastAllData.next([this.roles, this.sites, this.users]);
  }

}
