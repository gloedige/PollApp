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
  surveyDetails = inject(SurveyDetail);
  readonly questionOptions = signal<Option[]>([]);
  readonly hasMultipleOptions = signal(false);
  readonly questionText = signal('');
  readonly numberOfQuestion = signal(0);
  readonly order_letter = signal<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  /**
   * This function is called when the component is initialized. It retrieves the filtered options for the given question ID from the survey 
   * details service and updates the questionOptions signal with the fetched options. It also checks if the question has multiple options and 
   * updates the hasMultipleOptions signal accordingly. Additionally, it retrieves the question text and number of the question and updates the 
   * respective signals. Finally, it sets the order_letter signal with a predefined array of letters.
   */
  ngOnInit() {
    this.surveyDetails.getFilteredOptions(this.questionId);
    this.questionOptions.set(this.surveyDetails.filteredOptions);
    this.hasMultipleOptions.set(this.surveyDetails.getStateOfMultipleOptions(this.questionId));
    this.questionText.set(this.surveyDetails.questions().find(question => question.id === this.questionId)?.question ?? '');
    this.numberOfQuestion.set(this.surveyDetails.getNumberOfQuestion(this.questionId));
    this.order_letter.set(this.surveyDetails.order_letter);
  }


    
}
