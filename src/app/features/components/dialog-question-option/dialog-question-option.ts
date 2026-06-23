import { Component, Input, input} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-question-option',
  imports: [],
  templateUrl: './dialog-question-option.html',
  styleUrl: './dialog-question-option.scss',
})
export class DialogQuestionOption {
  order_letter = input<string>('A');
  optionId = input<string>('');
  optionText = input<string>('');
  formGroupOptionBlock = input<FormGroup>();

}
