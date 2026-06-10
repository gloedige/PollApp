import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-dialog-question-option',
  imports: [],
  templateUrl: './dialog-question-option.html',
  styleUrl: './dialog-question-option.scss',
})
export class DialogQuestionOption {
  @Input() order_letter: string = 'A';
  optionText: string = '';
  optionId: number = 0;


}
