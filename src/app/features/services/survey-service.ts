import { Injectable, signal, inject, computed, Renderer2 } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { Survey } from '../interfaces/survey';
import { Vote } from '../interfaces/vote';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  surveyDetail = signal<Survey | null>(null);
  selectedCategory = signal<string | null>(null);
  submitted = signal<boolean>(false);
  isSurveyDialogOpen = signal<boolean>(false);
  private readonly dbService = inject(SupabaseService);
  readonly isMobile = signal<boolean>(false);
  readonly mql = window.matchMedia('(max-width: 767px)');
  surveys = this.dbService.surveys;

  endingSoonSurveys = computed(this.getFilteredSurveysEndingSoon.bind(this));
  surveyState = signal<'active' | 'past' | 'undefined'>('active');
  pastSurveys = computed(() => this.filterPastSurveys());

  readonly visibleSurveys = computed(this.getFilteredSurveysByStateOrCategory.bind(this));
  readonly votesOfActiveSurvey = signal<Vote[]>([]);

  constructor() {
    this.isMobile.set(this.mql.matches);
  }

  /**
   * This function filters the surveys to find those that are ending soon. It checks if the expiry date of each survey 
   * is today or later.
   * @returns - An array of surveys that are ending soon.
   */
  getFilteredSurveysEndingSoon() {
    const todayStart = this.getStartOfDayTimestamp(new Date());
    const endingSurveys =  this.surveys().filter(survey => {
      if (!survey.expiry_date) return false;
      const expiryStart = this.getStartOfDayTimestamp(this.parseSurveyDate(survey.expiry_date));
      return expiryStart >= todayStart;
    });
    const orderedSurveys = this.orderSurveysByExpiryDate(endingSurveys);
    return orderedSurveys[0] ? orderedSurveys.slice(0, 3) : [];
  }
  
  /**
   * This function takes a Date object and returns the timestamp for the start of that day (at 00:00:00). It is used to normalize 
   * dates for comparison purposes.
   * @param date - The Date object for which to get the start of day timestamp.
   * @returns The timestamp representing the start of the given day.
   */
  private getStartOfDayTimestamp(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }

  /**
   * This function orders an array of surveys by their expiry date. It handles both date-only strings (in the format "YYYY-MM-DD")
   * and full date strings.
   * @param surveys - The array of surveys to order.
   * @returns An array of surveys ordered by their expiry date.
   */
  private orderSurveysByExpiryDate(surveys: Survey[]): Survey[] {
    return surveys.sort((a, b) => {
      const dateA = a.expiry_date ? this.parseSurveyDate(a.expiry_date).getTime() : 0;
      const dateB = b.expiry_date ? this.parseSurveyDate(b.expiry_date).getTime() : 0;
      return dateA - dateB;
    });
  }

  /**
   * This function filters the surveys to find those that have already expired. It checks if the expiry date of each survey is 
   * before the current date.
   * @returns An array of surveys that have already expired.
   */
  private filterPastSurveys() {
    const todayStart = this.getStartOfDayTimestamp(new Date());
    return this.surveys().filter(survey => {
      if (!survey.expiry_date) return false;
      return this.getStartOfDayTimestamp(this.parseSurveyDate(survey.expiry_date)) < todayStart;
    });
  }

  /**
   * This function parses a survey date from a string or Date object. It handles both date-only strings (in the format "YYYY-MM-DD")
   * and full date strings.
   * @param value - The date value to parse, either as a string or a Date object.
   * @returns A Date object representing the parsed date.
   */
  private parseSurveyDate(value: string | Date): Date {
    if (value instanceof Date) return value;

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    return new Date(value);
  }

  /**
   * This function retrieves all surveys from the Supabase database and updates the surveys signal with the fetched data. It logs the 
   * fetched surveys to the console for debugging purposes.
   * @returns An array of surveys filtered by the selected state and category.
   */
  getFilteredSurveysByStateOrCategory() {
    const category = this.selectedCategory();
    const state = this.surveyState();
    const todayStart = this.getStartOfDayTimestamp(new Date());
    const surveys = this.surveys();

    if (state === 'undefined') {
      return category == null
        ? surveys
        : surveys.filter((survey) => survey.category === category);
    }

    const byState = this.filterSurveysByExpiry(todayStart, surveys, state);
    if (category == null) return byState;
    return byState.filter((survey) => survey.category === category);
  }

  /**
   * This function filters surveys based on their expiry date and the specified state ('active' or 'past'). It compares the start of the day 
   * timestamp of each survey's expiry date with the current date to determine if it is active or past.
   * @param todayStart - The timestamp representing the start of the current day.
   * @param surveys - An array of surveys to filter.
   * @param state - The state to filter by, either 'active' or 'past'.
   * @returns - An array of surveys filtered by the specified state.
   */
  filterSurveysByExpiry(todayStart: number, surveys: Survey[], state: 'active' | 'past'): Survey[] {
    return surveys.filter((survey) => {
      if (survey.expiry_date == null) return state === 'active';
      const expiryStart = this.getStartOfDayTimestamp(
        this.parseSurveyDate(survey.expiry_date)
      );
      if (expiryStart >= todayStart) return state === 'active';
      else if (expiryStart < todayStart) return state === 'past';
      else return false;
    });
  }

  /**
   * This function collects the votes for the current survey based on the selected options for a given question. 
   * @param questionId - The ID of the question for which to collect votes.
   * @param optionIds - An array of option IDs that have been selected for the question.
   */
  collectVotesOfActiveSurvey(questionId: number, optionIds: number[]) {
    const existingVotes: Vote[] = this.votesOfActiveSurvey();
    const filteredVotesByQuestionId: Vote[] = this.deleteVotesByQuestionId(questionId, existingVotes);
    const updatedVotes: Vote[] = this.addVotesForQuestion(questionId, optionIds, filteredVotesByQuestionId);
    
    this.votesOfActiveSurvey.set(updatedVotes);
  } 

  /**
   * This function deletes votes for a specific question ID from the given array of votes. It filters out any votes
   * that have a matching question ID.
   * @param questionId - The ID of the question for which to delete votes.
   * @param votes - The array of votes from which to delete votes.
   * @returns A new array of votes with the votes for the specified question ID removed.
   */
  deleteVotesByQuestionId(questionId: number, votes: Vote[]): Vote[] {
    if (questionId === 0) return votes;
    return votes.filter(vote => vote.question_id !== questionId);
  }

  /**
   * This function adds votes for a specific question ID to the given array of votes. It creates a new vote for each option ID
   * and appends it to the votes array.
   * @param questionId - The ID of the question for which to add votes.
   * @param optionIds - An array of option IDs for which to add votes.
   * @param votes - The array of votes to which the new votes will be added.
   * @returns A new array of votes with the added votes for the specified question ID.
   */
  addVotesForQuestion(questionId: number, optionIds: number[], votes: Vote[]): Vote[] {
    if (questionId === 0 || optionIds.length === 0) return votes;

    const newVotes = optionIds.map((optionId) => {
      const newVote: Vote = {
        question_id: questionId,
        option_id: optionId
      };

      return newVote;
    });

    return [...votes, ...newVotes];
  }
  
/**
 * This function opens the survey dialog by selecting the 'app-survey-dialog' element from the DOM and setting its display style to 'block'.
 * It allows users to create a new survey by displaying the survey dialog.
 */
  openSurveyDialog() {
    const surveyDialog = document.querySelector('app-survey-dialog') as HTMLElement;
    if (surveyDialog) {
      surveyDialog.style.display = 'block';
      this.isSurveyDialogOpen.set(true);
    }
  }

  /**
   * This function closes the survey dialog by selecting the 'app-survey-dialog' element from the DOM and setting its display style to 'none'.
   * It allows users to exit the survey dialog without creating a new survey.
   * @returns - void
   */
  closeSurveyDialog() {
    const surveyDialog = document.querySelector('app-survey-dialog') as HTMLElement;
    if (surveyDialog) {
      surveyDialog.style.display = 'none';
      this.isSurveyDialogOpen.set(false);
    }
  }

  /**
   * This function clears the value of a specific input field in the survey form. It takes the control name as an argument, finds the 
   * corresponding input element in the DOM, and sets its value to an empty string.
   * @param controlName - The name of the control/input field to clear.
   */
  clearSurveyFormInputField(controlName: string, id?: string) {
    const surveyDialogRef = document.querySelector('app-survey-dialog') as any;
    const controlElement = id 
      ? surveyDialogRef?.querySelector(`#${id}`) 
      : surveyDialogRef?.querySelector(`[formControlName="${controlName}"]`);

    if (controlElement) {
      (controlElement as HTMLInputElement).value = '';
    }
  }

}
