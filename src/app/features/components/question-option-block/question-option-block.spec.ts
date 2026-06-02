import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionOptionBlock } from './question-option-block';

describe('QuestionOptionBlock', () => {
  let component: QuestionOptionBlock;
  let fixture: ComponentFixture<QuestionOptionBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionOptionBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionOptionBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
