import { Component, Input, signal, inject } from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';

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
  @Input() questionId = 0;
  surveyDetails = inject(SurveyDetail);
  @Input() result!: Result;
  readonly questionText = signal('');
  readonly numberOfQuestion = signal(0);

  ngOnInit() {
    this.questionText.set(this.surveyDetails.questions().find(question => question.id === this.questionId)?.question ?? '');
    this.numberOfQuestion.set(this.surveyDetails.getNumberOfQuestion(this.questionId));
  }   
}
