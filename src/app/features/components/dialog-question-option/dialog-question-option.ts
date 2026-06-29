import { Component, Input, input} from '@angular/core';
import { ControlContainer, FormGroupName } from '@angular/forms';

@Component({
  selector: 'app-dialog-question-option',
  imports: [],
  templateUrl: './dialog-question-option.html',
  styleUrl: './dialog-question-option.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }]
})
export class DialogQuestionOption {
  order_letter = input<string>('A');
  optionIndex = input.required<number>();
  questionIndex = input.required<number>();
  // optionText = input<string>('');

  constructor(private controlContainer: ControlContainer) {}

}
