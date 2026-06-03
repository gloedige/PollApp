import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-question-option',
  imports: [],
  templateUrl: './question-option.html',
  styleUrl: './question-option.scss',
})
export class QuestionOption {
  @Input() optionText = 'Option text';
  @Input() counter_letter = 'A';
}
  