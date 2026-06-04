import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionResultBlock } from './question-result-block';

describe('QuestionResultBlock', () => {
  let component: QuestionResultBlock;
  let fixture: ComponentFixture<QuestionResultBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionResultBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionResultBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
