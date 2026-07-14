import { Component, inject, Renderer2, signal, LOCALE_ID, computed } from '@angular/core';
import { Button } from "../../shared/components/button/button";
import { DOCUMENT } from "@angular/common";
import {Router} from "@angular/router";
import { QuestionOptionBlock } from '../components/question-option-block/question-option-block';
import { QuestionResultBlock } from '../components/question-result-block/question-result-block';
import { SurveyDialog } from '../survey-dialog/survey-dialog';
import { SurveyService } from '../services/survey-service';
import { SupabaseService } from '../services/supabase-service';
import {ActivatedRoute} from "@angular/router";
import { Survey } from '../interfaces/survey';
import {DatePipe} from "@angular/common";
import { switchMap } from 'rxjs';
import {InfoOverlay} from "../../shared/components/info-overlay/info-overlay";

@Component({
  selector: 'app-survey-detail',
  imports: [Button, QuestionOptionBlock, QuestionResultBlock, SurveyDialog, DatePipe, InfoOverlay],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  readonly loadingDone = signal(false);
  readonly showResults = signal(true);
  readonly localeId = inject(LOCALE_ID);
  
  multipleOptions: boolean = false;
  numberOfQuestion: number = 0;
  order_letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  surveyService = inject(SurveyService);
  survey = signal<Survey | null>(null);
  dbService = inject(SupabaseService);
  readonly questions = this.dbService.questions;
  readonly votesOfActiveSurvey = this.surveyService.votesOfActiveSurvey;
  surveyId: number | null = null;
  showDetailOverlay = signal<boolean>(false);
  detailOverlayMessage = signal<string>('');
  surveyIdArrayFromLocalStorage: number[] = computed(() => this.surveyService.getSurveyIdsFromLocalStorage())();

  /**
   * This function is called when the component is initialized. It adds a CSS class to the body element to apply specific styles for the survey detail page. 
   * It also fetches all questions and options related to the active survey from the database.
   * @returns - void
   */
  async ngOnInit(): Promise<void> {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.surveyId = Number(params.get('id'));
        return this.dbService.getSurveyById(this.surveyId);
      })
    ).subscribe(async data => {
      this.survey.set(data);
      await this.dbService.getAllQuestionsBySurveyId(this.surveyId!);
      await this.dbService.getAllOptions();
      this.surveyService.votesOfActiveSurvey.set([]);
    });

    this.loadingDone.set(false);
    this.renderer.addClass(this.document.body, 'detail-page');
    if (!this.surveyId) {
      this.loadingDone.set(true);
      return;
    }
    this.loadingDone.set(true);
  }

  /**
   * This function is called when the component is destroyed. It removes the CSS class from the body element that was added in 
   * ngOnInit() to clean up the styles.
   * @returns - void
   */
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'detail-page');
    this.renderer.removeClass(this.document.body, 'noscroll');
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
    if (this.IsSurveyIdExistingInLocalStorage(this.surveyId!)) {
      await this.showInfoByOverlay('You have already completed this survey!');
      return;
    }
    if (this.votesOfActiveSurvey().length > 0) {
      await this.dbService.addNewVotes(this.votesOfActiveSurvey());
      this.surveyService.storeSurveyIdsInLocalStorage([this.surveyId!]);
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * This function is called when the user wants to open the survey dialog to create a new survey. It calls the openSurveyDialog()
   * method from the SurveyService to display the survey dialog and adds a CSS class to the body element to prevent scrolling.
   */
  openDialog() {
    this.surveyService.openSurveyDialog();
    this.renderer.addClass(this.document.body, 'noscroll');
  }

  /**
   * This function is called when the user wants to see the results of the survey. It toggles the showResults signal to either show 
   * or hide the survey results.
   */
  toggleResults() {
    this.showResults.set(!this.showResults());
  }

  /**
   * This function shows an information overlay with a specific message. It sets the showDetailOverlay signal to true and updates the detailOverlayMessage
   * signal with the provided message. This allows users to see important information or notifications related to the survey detail.
   * @param message - The message to be displayed in the overlay. 
   */
  async showInfoByOverlay(message: string) {
    this.showDetailOverlay.set(true);
    this.detailOverlayMessage.set(message);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1400);
    });
  }

  /**
   * This function checks if a survey ID exists in the local storage. It retrieves the array of survey IDs from local storage and checks if the provided survey
   * ID is included in that array. If the survey ID exists in local storage, it returns true; otherwise, it returns false.
   * @param surveyId - The ID of the survey to check in local storage.
   * @returns - True if the survey ID exists in local storage, false otherwise.
   */
  IsSurveyIdExistingInLocalStorage(surveyId: number): boolean {
    return this.surveyIdArrayFromLocalStorage.includes(surveyId);
  }

}
