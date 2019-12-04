import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallReportingComponent } from './call-reporting.component';

describe('CallReportingComponent', () => {
  let component: CallReportingComponent;
  let fixture: ComponentFixture<CallReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
