import { Component, Input } from '@angular/core';

type Result = {
    id: number;
    question_id: number;
    option_id: number;
}

@Component({
  selector: 'app-question-result-block',
  imports: [],
  templateUrl: './question-result-block.html',
  styleUrl: './question-result-block.scss',
})
export class QuestionResultBlock {
  @Input() result!: Result;
}
