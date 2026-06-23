import { Component, inject, Renderer2, signal, computed} from '@angular/core';
import { Button } from "../../shared/components/button/button";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";
import { QuestionOptionBlock } from '../components/question-option-block/question-option-block';
import { QuestionResultBlock } from '../components/question-result-block/question-result-block';
import { SurveyDialog } from '../survey-dialog/survey-dialog';
import { SurveyService } from '../services/survey-service';
import { SupabaseService } from '../services/supabase-service';

@Component({
  selector: 'app-survey-detail',
  imports: [Button, QuestionOptionBlock, QuestionResultBlock, SurveyDialog],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  readonly loadingDone = signal(false);
  
  multipleOptions: boolean = false;
  numberOfQuestion: number = 0;
  order_letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  surveyService = inject(SurveyService);
  survey = this.surveyService.surveyDetail;
  dbService = inject(SupabaseService);
  readonly questions = this.dbService.questions;
  readonly votesOfActiveSurvey = this.surveyService.votesOfActiveSurvey;

  /**
   * This function is called when the component is initialized. It adds a CSS class to the body element to apply specific 
   * styles for the survey detail page. It also retrieves the active survey ID using the getActiveSurveyId() method and 
   * logs it to the console for debugging purposes.
   * @returns - void
   */
  async ngOnInit(): Promise<void> {
    this.loadingDone.set(false);
    this.renderer.addClass(this.document.body, 'detail-page');
    const surveyId = this.survey()?.id;
    if (!surveyId) {
      this.loadingDone.set(true);
      return;
    }

    await this.dbService.getAllQuestionsBySurveyId(surveyId);
    await this.dbService.getAllOptions();
    this.loadingDone.set(true);
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
   * This function is called when the user completes the survey. It checks if there are any votes collected for the active survey.
   * After storing the votes in the database, it navigates the user to the dashboard page.
   * @returns - void
   */
  async completeSurvey() {
    if (this.votesOfActiveSurvey().length > 0) {
      await this.dbService.addNewVotes(this.votesOfActiveSurvey());
      this.router.navigate(['/dashboard']);
    }
  }

}
