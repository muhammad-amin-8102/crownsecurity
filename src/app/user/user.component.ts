import { Component, OnInit, Host, OnDestroy, ViewChild } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { CONSTANTS } from '@app/constants';
import { UserRole } from '@app/_models/role';
import { cloneDeep, pick } from 'lodash';
import { isWithinInterval } from 'date-fns';
import { FilterUtils, DialogService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService } from '@app/_services';
import { User } from '@app/_models/user';
import { EditUserComponent } from '@app/edit-user/edit-user.component';
import { SharedService } from '@app/shared.service';
import { Site } from '@app/_models/site';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  public users: User[] = [];
  roles: UserRole[] = [];
  sites: Site[] = [];
  public usersCols = CONSTANTS.usersCols;
  public genders = [
    {
      name: 'Male'
    },
    {
      name: 'Female'
    }
  ];
  @ViewChild('dtuser', { static: true }) private table: Table;
  public fromDate: string = null;
  public toDate: string = null;
  public filterActive: boolean = true;
  totalRecords: number = 0;
  loading: boolean = true;

  constructor(
    @Host() private appComponent: AppComponent,
    private dialogService: DialogService,
    private userService: UserService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.appComponent.pageTitle = 'Users';
    this.roles = this.sharedService.roles;
    this.sites = this.sharedService.sites;
    this.users = this.sharedService.users;
    this.sharedService.broadcastAllData.subscribe(allData => {
      if (allData) {
        [this.roles, this.sites, this.users] = allData;
        this.loading = false;
        this.users.forEach((x: any) => {
          x = this.getUserRowObject(x);
        });
        this.totalRecords = this.users.length;
      }
    });
    // custome filters
    FilterUtils['role_dropdown_filter'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return String(value.name).toLowerCase().indexOf(filter) > -1;
    };

    FilterUtils['dob_filter'] = (value, filter): boolean => {
      if (filter.length && new Date(filter[0]) < new Date(filter[1])) {
        return isWithinInterval(new Date(value), {
          start: new Date(filter[0]),
          end: new Date(filter[1])
        });
      }
      return false;
    };

    FilterUtils['gender_filter'] = (value, filter): boolean => {
      return String(value.name).toLowerCase().includes(String(filter).toLowerCase());
    };
  }

  filterColumns(value, column, filter) {
    this.table.filter(value, column, filter);
  }

  getUserRowObject(user = null): User {
    let resultUser = new User();
    if (!user) {
      return resultUser;
    }
    resultUser = Object.assign({}, resultUser, user);
    resultUser.role_id = cloneDeep(user.role.id);
    return resultUser;
  }

  dobRangeFilter() {
    if (this.fromDate && this.toDate) {
      return this.table.filter([this.fromDate, this.toDate], 'dob', 'dob_filter');
    }
    return false;
  }

  addUser() {
    const rowData = this.getUserRowObject();
    rowData.edit = true;
    this.dialogService.open(EditUserComponent, {
      data: {
          user: rowData
      },
      header: 'Add User'
    });
  }

  onRowEdit(rowData: User) {
    rowData.edit = true;
    this.dialogService.open(EditUserComponent, {
      data: {
          user: rowData
      },
      header: 'Edit User'
    });
  }

  onRowDelete(rowData: User) {
    if (rowData.id) {
      this.userService.delete(pick(rowData, CONSTANTS.userDeleteRequestProps)).subscribe(
        () => {
          this.users.splice(this.users.findIndex(x => x === rowData), 1);
        }
      );
    } else {
      this.users.splice(this.users.findIndex(x => x === rowData), 1);
    }
  }

  onDateRangeRefresh() {
    this.fromDate = this.toDate = null;
    return this.table.filter([], 'dob', 'dob_filter');
  }

  ngOnDestroy() {
  }
}
