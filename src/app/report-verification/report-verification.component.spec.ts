import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVerificationComponent } from './report-verification.component';

describe('ReportVerificationComponent', () => {
  let component: ReportVerificationComponent;
  let fixture: ComponentFixture<ReportVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
