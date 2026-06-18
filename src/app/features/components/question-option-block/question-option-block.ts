import { Component, signal, Input, inject, computed, input } from '@angular/core';
import { QuestionOption } from '../question-option/question-option';
import { SurveyDetail } from '../../survey-detail/survey-detail';
import { SupabaseService } from '../../services/supabase-service';
import { SurveyService } from '../../services/survey-service';

@Component({
  selector: 'app-question-option-block',
  imports: [QuestionOption],
  templateUrl: './question-option-block.html',
  styleUrl: './question-option-block.scss',
})


export class QuestionOptionBlock {
  questionId = input<number>(0);
  
  surveyDetails = inject(SurveyDetail);
  dbService = inject(SupabaseService);
  readonly surveyService = inject(SurveyService);
  readonly questionOptions = computed(() => this.dbService.options().filter(option => option.question_id === this.questionId()));
  readonly isSingleOptionSelected = signal<boolean>(false);
  readonly hasMultipleOptions = signal<boolean>(false);
  readonly questionText = signal('');
  readonly numberOfQuestion = signal(0);
  readonly order_letter = signal<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);



  /**
   * This function is called when the component is initialized. It retrieves the filtered options for the given question ID from the survey 
   * details service and updates the questionOptions signal with the fetched options. It also checks if the question has multiple options and 
   * updates the hasMultipleOptions signal accordingly. Additionally, it retrieves the question text and number of the question and updates the 
   * respective signals. Finally, it sets the order_letter signal with a predefined array of letters.
   */
  async ngOnInit() {
    this.hasMultipleOptions.set(this.surveyDetails.getStateOfMultipleOptions(this.questionId()));
    this.questionText.set(this.surveyDetails.questions().find(question => question.id === this.questionId())?.question ?? '');
    this.numberOfQuestion.set(this.surveyDetails.getNumberOfQuestion(this.questionId()));
    this.order_letter.set(this.surveyDetails.order_letter);

  }


  selectedOptionIds = signal<number[]>([]);

  isSelected(id: number): boolean {
    return this.selectedOptionIds().includes(id);
  }


  handleCheckboxToggle(optionId: number): void {
    const currentSelectedOptionIds = this.selectedOptionIds();

    if(this.hasMultipleOptions()) {
      if (currentSelectedOptionIds.includes(optionId)) {
        this.selectedOptionIds.set(currentSelectedOptionIds.filter(id => id !== optionId));
      } else {
        this.selectedOptionIds.set([...currentSelectedOptionIds, optionId]);
      } 
    } else {
      if (currentSelectedOptionIds.includes(optionId)) {
        this.selectedOptionIds.set([]);
      } else {
        this.selectedOptionIds.set([optionId]);
      }
    }
  }
  
}


    
