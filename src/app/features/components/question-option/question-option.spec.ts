import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionOption } from './question-option';

describe('QuestionOption', () => {
  let component: QuestionOption;
  let fixture: ComponentFixture<QuestionOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionOption],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionOption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
