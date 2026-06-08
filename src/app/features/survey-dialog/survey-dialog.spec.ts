import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDialog } from './survey-dialog';

describe('SurveyDialog', () => {
  let component: SurveyDialog;
  let fixture: ComponentFixture<SurveyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
