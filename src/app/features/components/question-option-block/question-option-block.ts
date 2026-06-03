import { Component, signal, Input, inject } from '@angular/core';
import { QuestionOption } from '../question-option/question-option';
import { SurveyDetail } from '../../survey-detail/survey-detail';

type Question = {
    id: number;
    question: string;
    survey_id: number;
    multiple_options: boolean;
}
type Option = {
    id: number;
    question_id: number;
    option_text: string;
    option_selected: boolean;
}

@Component({
  selector: 'app-question-option-block',
  imports: [QuestionOption],
  templateUrl: './question-option-block.html',
  styleUrl: './question-option-block.scss',
})


export class QuestionOptionBlock {
  @Input() questionId = 0;
  readonly questionOptions = signal<Option[]>([]);
  surveyDetails = inject(SurveyDetail);

  ngOnInit() {
    this.surveyDetails.getFilteredOptions(this.questionId);
    this.questionOptions.set(this.surveyDetails.filteredOptions);
  }


    
}
