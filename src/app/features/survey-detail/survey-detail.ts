import { Component, inject, Renderer2, signal} from '@angular/core';
import { Button } from "../../shared/components/button/button";
import {DOCUMENT} from "@angular/common";
import { QuestionOptionBlock } from '../components/question-option-block/question-option-block';
import { QuestionResultBlock } from '../components/question-result-block/question-result-block';
import { SurveyDialog } from '../survey-dialog/survey-dialog';
import { SurveyService } from '../services/survey-service';

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

type Result = {
    id: number;
    question_id: number;
    option_id: number;
}

@Component({
  selector: 'app-survey-detail',
  imports: [Button, QuestionOptionBlock, QuestionResultBlock, SurveyDialog],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  filteredOptions: Option[] = [];
  multipleOptions: boolean = false;
  numberOfQuestion: number = 0;
  order_letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  surveyService = inject(SurveyService);
  survey = this.surveyService.surveyDetail;

  /**
   * This function is called when the component is initialized. It adds a CSS class to the body element to apply specific 
   * styles for the survey detail page. It also retrieves the active survey ID using the getActiveSurveyId() method and 
   * logs it to the console for debugging purposes.
   * @returns - void
   */
  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'detail-page');
    
  }

  /**
   * This function is called when the component is destroyed. It removes the CSS class from the body element that was added in 
   * ngOnInit() to clean up the styles.
   * @returns - void
   */
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'detail-page');
  }

  /**
   * This function filters the options based on the provided question ID. It updates the filteredOptions property with the options
   * that belong to the specified question.
   * @param questionId - The ID of the question for which to filter options.
   */
  getFilteredOptions(questionId: number) {
    this.filteredOptions = this.options().filter(option => option.question_id === questionId);
  }

  /**
   * This function checks if a question has multiple options based on the provided question ID. It updates the multipleOptions property
   * with the value of the multiple_options property of the corresponding question.
   * @param questionId - The ID of the question for which to check if it has multiple options.
   * @returns - A boolean indicating whether the question has multiple options or not.
   */
  getStateOfMultipleOptions(questionId: number) {
    this.multipleOptions = this.questions().find(question => question.id === questionId)?.multiple_options ?? false;
    return this.multipleOptions;
  }

  /**
   * This function retrieves the number of a question based on the provided question ID. It updates the numberOfQuestion property
   * with the index of the corresponding question in the questions array.
   * @param questionId - The ID of the question for which to retrieve the number.
   * @returns - The number of the question.
   */
  getNumberOfQuestion(questionId: number) {
    this.numberOfQuestion = this.questions().findIndex(question => question.id === questionId) + 1;
    return this.numberOfQuestion;
  }

  /**
   * This function retrieves the order letter based on the provided index.
   * @param index - The index for which to retrieve the order letter.
   * @returns - The order letter corresponding to the index.
   */
  getOrderLetter(index: number) {
    return this.order_letter[index] ?? '';
  }

  /**
   * This function retrieves the active survey ID from the activeSurveyCard component. It returns the active survey ID, which can be used
   * for fetching the corresponding survey data based on the ID or for other purposes related to the active survey.
   * @returns - The active survey ID from the activeSurveyCard component.
   */


  readonly questions = signal<Question[]>([
    {
      id: 1,
      question: 'Let\'s plan the next team event together',
      survey_id: 1,
      multiple_options: true
    },
    {
      id: 2,
      question: 'How should we improve our weekly stand-up?',
      survey_id: 2,
      multiple_options: false
    },
    {
      id: 3,
      question: 'Select topics for our monthly knowledge sharing sessions',
      survey_id: 3,
      multiple_options: true
    },
  ]);
  readonly options = signal<Option[]>([
    {
        id: 1,
        question_id: 1,
        option_text: 'Go-karting',
        option_selected: false
    },
    {
        id: 2,
        question_id: 1,
        option_text: 'Escape room',
        option_selected: false
    },
    {
        id: 3,
        question_id: 1,
        option_text: 'Cooking class',
        option_selected: false
    },
    {
        id: 4,
        question_id: 2,
        option_text: 'Use a timer to keep updates concise',
        option_selected: false
    },
    {
        id: 5,
        question_id: 2,
        option_text: 'Have a rotating facilitator',
        option_selected: false
    },
    {
        id: 6,
        question_id: 2,
        option_text: 'Focus on blockers and progress',
        option_selected: false
    },
    {
        id: 7,
        question_id: 3,
        option_text: 'Time management techniques',
        option_selected: false
    },
    {
        id: 8,
        question_id: 3,
        option_text: 'Effective communication',
        option_selected: false
    },
    {
        id: 9,
        question_id: 3,
        option_text: 'Stress management',
        option_selected: false
    },
  ]);

  readonly results = signal<Result[]>([
    {
      id: 1,
      question_id: 1,
      option_id: 1
    },
    {
      id: 2,
      question_id: 1,
      option_id: 2
    },
    {
      id: 3,
      question_id: 2,
      option_id: 4
    },
    {
      id: 4,
      question_id: 3,
      option_id: 7
    },
    {
      id: 5,
      question_id: 3,
      option_id: 8
    },
    {
      id: 6,
      question_id: 3,
      option_id: 9
    }
  ]);
}
