import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogQuestionOptionBlock } from './dialog-question-option-block';

describe('DialogQuestionOptionBlock', () => {
  let component: DialogQuestionOptionBlock;
  let fixture: ComponentFixture<DialogQuestionOptionBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogQuestionOptionBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogQuestionOptionBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
