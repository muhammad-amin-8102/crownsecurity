import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, MessageService } from 'primeng/api';
import { User, UserRole } from '@app/_models';
import { SharedService } from '@app/shared.service';
import { format, differenceInYears } from 'date-fns';
import { pick } from 'lodash';
import { CONSTANTS } from '@app/constants';
import { UserService } from '@app/_services/user.service';
import { Site } from '@app/_models/site';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: User = null;
  roles: UserRole[] = [];
  sites: Site[] = [];
  public genders = [
    {
      name: 'Male'
    },
    {
      name: 'Female'
    }
  ];
  todayDate: Date = new Date();
  age: any;

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService) { }

  ngOnInit() {
    this.roles = this.sharedService.roles;
    this.sites = this.sharedService.sites;
    this.user = this.config.data.user;
    this.user.dobDate = this.user.dob ? new Date(Date.parse(this.user.dob)) : null;
    this.user.startDateObj = this.user.start_date ? new Date(Date.parse(this.user.start_date)) : null;
    this.user.genderObj = this.genders.find(x => x.name === this.user.gender);
    this.user.site = this.sites.find(y =>
      this.user.linked_site_code && y.site_code && this.user.linked_site_code.trim() === y.site_code.trim()
    );
    this.age = differenceInYears;
  }

  onRowUpsert(rowData: any) {
    rowData.role_id = rowData.role ? rowData.role.id : null;
    rowData.gender = rowData.genderObj ? rowData.genderObj.name : '';
    rowData.dob = rowData.dobDate ? format(new Date(new Date(rowData.dobDate).toLocaleDateString()), 'yyyy-MM-dd') : '';
    rowData.start_date = rowData.startDateObj ? format(new Date(new Date(rowData.startDateObj).toLocaleDateString()), 'yyyy-MM-dd') : '';
    rowData.linked_site_code = rowData.site ? rowData.site.site_code : '';
    if (this.isDataValid(rowData)) {
      if (!rowData.id) {
        // create user
        this.userService.create(pick(rowData, CONSTANTS.userCreateRequestProps)).subscribe(
          (data: any) => {
            rowData.edit = false;
            this.sharedService.users.push(Object.assign({}, rowData, data));
            const successMsg = Object.assign({}, CONSTANTS.successMessage);
            successMsg.summary = 'User Created';
            successMsg.detail = 'User Created Successfully';
            this.messageService.add(successMsg);
            this.sharedService.broadcastData();
            this.ref.close();
          }
        );
      } else {
        // update user
        this.userService.update(pick(rowData, CONSTANTS.userUpdateRequestProps)).subscribe(
          (data: any) => {
            rowData.edit = false;
            this.sharedService.users.forEach(x => {
              if (x.id === rowData.id) {
                x = Object.assign({}, rowData);
              }
            });
            const successMsg = Object.assign({}, CONSTANTS.successMessage);
            successMsg.summary = 'User Updated';
            successMsg.detail = 'User Updated Successfully';
            this.messageService.add(successMsg);
            this.sharedService.broadcastData();
            this.ref.close();
          }
        );
      }
    }
  }

  isDataValid(user: User) {
    const checkValidFields = [
      'address',
      'adhaar',
      'adhaar_name',
      'code',
      'contact_number',
      'dob',
      'start_date',
      'firstname',
      'gender',
      'lastname',
      'linked_site_code',
      'role_id',
      'pan'
    ];
    const validationArray = [];

    checkValidFields.forEach(x => {
      if (!user[x]) {
        const errorObj = Object.assign({}, CONSTANTS.errorMessage);
        errorObj.summary = 'Validation Error';
        errorObj.detail = x + ' is required';
        validationArray.push(errorObj);
      }
    });

    if (validationArray.length) {
      this.messageService.addAll(validationArray);
      return false;
    }
    return true;
  }
}
