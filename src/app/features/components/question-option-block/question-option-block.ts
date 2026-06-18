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
  selectedOptionIds = signal<number[]>([]);
  
  surveyDetails = inject(SurveyDetail);
  dbService = inject(SupabaseService);
  readonly surveyService = inject(SurveyService);
  readonly questionOptions = computed(() => this.dbService.options().filter(option => option.question_id === this.questionId()));
  readonly isSingleOptionSelected = signal<boolean>(false); // not in use yet!
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



  /**
   * This function checks if a specific option ID is currently selected. It does this by checking if the option ID is included in the 
   * selectedOptionIds signal.
   * @param id -  The ID of the option to check for selection.
   * @returns - A boolean value indicating whether the specified option ID is currently selected or not.
   */
  isSelected(id: number): boolean {
    return this.selectedOptionIds().includes(id);
  }

  /**
   * This function handles the toggle event of a checkbox for an option. It checks if the question allows multiple options and updates the
   * selectedOptionIds signal accordingly. If multiple options are allowed, it adds or removes the option ID from the selectedOptionIds array.
   * If only a single option is allowed, it sets the selectedOptionIds signal to an array containing only the toggled option ID or an empty array 
   * if the same option is toggled again.
   * @param optionId - The ID of the option that was toggled. (not in use yet, but will be needed for the backend implementation)
   */
  handleCheckboxToggle(optionId: number): void {
    const currentSelectedOptionIds = this.selectedOptionIds();

    if(this.hasMultipleOptions()) {
      this.handleMultipleOptionsToggle(optionId, currentSelectedOptionIds);
    } else {
      this.handleSingleOptionToggle(optionId, currentSelectedOptionIds);
    }
  }

  /**
   * This function handles the toggle event for multiple options. It checks if the toggled option ID is already included in the currentSelectedOptionIds 
   * array. If it is included, it removes the option ID from the selectedOptionIds array. If it is not included, it adds the option ID to the selectedOptionIds
   * array.
   * @param optionId - The ID of the option that was toggled.
   * @param currentSelectedOptionIds - The array of currently selected option IDs.
   */
  private handleMultipleOptionsToggle(optionId: number, currentSelectedOptionIds: number[]): void {
    if (currentSelectedOptionIds.includes(optionId)) {
        this.selectedOptionIds.set(currentSelectedOptionIds.filter(id => id !== optionId));
      } else {
        this.selectedOptionIds.set([...currentSelectedOptionIds, optionId]);
      } 
  }

  /**
   * This function handles the toggle event for single options. It checks if the toggled option ID is already included in the currentSelectedOptionIds array.
   * If it is included, it clears the selectedOptionIds signal. If it is not included, it sets the selectedOptionIds signal to an array containing only the 
   * toggled option ID.
   * @param optionId - The ID of the option that was toggled.
   * @param currentSelectedOptionIds - The array of currently selected option IDs.
   */
  private handleSingleOptionToggle(optionId: number, currentSelectedOptionIds: number[]): void {
    if (currentSelectedOptionIds.includes(optionId)) {
      this.selectedOptionIds.set([]);
      this.isSingleOptionSelected.set(false); // not in use yet!
    } else {
      this.selectedOptionIds.set([optionId]);
      this.isSingleOptionSelected.set(true); // not in use yet!
    }
  }


}


    
