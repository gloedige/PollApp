import { Component, Input, input} from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-dialog-question-option',
  imports: [],
  templateUrl: './dialog-question-option.html',
  styleUrl: './dialog-question-option.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class DialogQuestionOption {
  order_letter = input<string>('A');
  optionText = input<string>('');
  // control = input.required<FormGroup>();

  optionIndex = input.required<number>();
  questionIndex = input.required<number>();

  constructor(private controlContainer: ControlContainer) {}

}
