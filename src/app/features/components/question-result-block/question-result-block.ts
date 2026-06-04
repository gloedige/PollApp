import { Component, Input, signal, inject } from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';
import { BarChartBlock } from '../bar-chart-block/bar-chart-block';

type Result = {
    id: number;
    question_id: number;
    option_id: number;
}
type Option = {
    id: number;
    question_id: number;
    option_text: string;
    option_selected: boolean;
}

@Component({
  selector: 'app-question-result-block',
  imports: [BarChartBlock],
  templateUrl: './question-result-block.html',
  styleUrl: './question-result-block.scss',
})
export class QuestionResultBlock {
  @Input() questionId = 0;
  surveyDetails = inject(SurveyDetail);
  @Input() result!: Result;
  readonly questionText = signal('');
  readonly numberOfQuestion = signal(0);
  readonly questionOptions = signal<Option[]>([]);
  readonly order_letter = signal<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  ngOnInit() {
    this.questionText.set(this.surveyDetails.questions().find(question => question.id === this.questionId)?.question ?? '');
    this.numberOfQuestion.set(this.surveyDetails.getNumberOfQuestion(this.questionId));
    this.questionOptions.set(this.surveyDetails.filteredOptions);
  }   
}
