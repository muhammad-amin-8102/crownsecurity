import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor, fakeBackendProvider } from './_helpers';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CallReportingComponent } from './call-reporting/call-reporting.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { SiteComponent } from './site/site.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderInterceptor } from './_interceptors/loader.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ViewReportComponent } from './view-report/view-report.component';
import { AgGridModule } from 'ag-grid-angular';
import { AdhocNewUserComponent } from './adhoc-new-user/adhoc-new-user.component';
import { UserComponent } from './user/user.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/api';
import { EditUserComponent } from './edit-user/edit-user.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedService } from './shared.service';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		SidebarComponent,
		DashboardComponent,
		LoginComponent,
		CallReportingComponent,
		SiteComponent,
		ViewReportComponent,
		AdhocNewUserComponent,
		UserComponent,
		EditUserComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		AppRoutingModule,
		ReactiveFormsModule,
		HttpClientModule,
		DropdownModule,
		TableModule,
		CheckboxModule,
		CalendarModule,
		CardModule,
		NgxSpinnerModule,
		ToastModule,
		DynamicDialogModule,
		InputTextModule,
		InputTextareaModule,
		AgGridModule.withComponents([])
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
		MessageService,
		DialogService,
		SharedService
		// provider used to create fake backend
		// fakeBackendProvider
	],
	entryComponents: [
		EditUserComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
