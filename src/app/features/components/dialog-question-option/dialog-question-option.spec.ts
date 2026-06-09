import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogQuestionOption } from './dialog-question-option';

describe('DialogQuestionOption', () => {
  let component: DialogQuestionOption;
  let fixture: ComponentFixture<DialogQuestionOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogQuestionOption],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogQuestionOption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
