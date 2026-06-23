import { Injectable, signal, inject, computed } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { Survey } from '../interfaces/survey';
import { Question } from '../interfaces/question';
import { Vote } from '../interfaces/vote';
import { Option } from '../interfaces/option';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  surveyList = signal<Survey[]>([]);
  surveyDetail = signal<Survey | null>(null);
  selectedCategory = signal<string | null>(null);
  private readonly dbService = inject(SupabaseService);
  surveys = this.dbService.surveys;

  endingSoonSurveys = computed(this.getFilteredSurveysEndingSoon.bind(this));
  surveyState = signal<'active' | 'past'>('active');
  activeSurveys = computed(() => this.filterActiveSurveys());
  pastSurveys = computed(() => this.filterPastSurveys());

  readonly visibleSurveys = computed(this.getFilterdSurveysByStateOrCategory.bind(this));
  readonly votesOfActiveSurvey = signal<Vote[]>([]);

  constructor() {
    
  }

    /**
   * This function filters the surveys to find those that are ending soon. It checks if the expiry date of each survey 
   * is within the next three days.
   * @returns - An array of surveys that are ending soon.
   */
  getFilteredSurveysEndingSoon() {
    const todayStart = this.getStartOfDayTimestamp(new Date());
    const threeDaysLaterStart = this.getStartOfDayTimestamp(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));

    return this.surveys().filter(survey => {
      const expiryStart = this.getStartOfDayTimestamp(this.parseSurveyDate(survey.expiry_date));
      return expiryStart >= todayStart && expiryStart <= threeDaysLaterStart;
    });
  }

  /**
   * This function filters the surveys to find those that are still active. It checks if the expiry date of each survey is 
   * on or after the current date.
   * @returns An array of surveys that are still active.
   */
  filterActiveSurveys() {
    const todayStart = this.getStartOfDayTimestamp(new Date());
    return this.surveys().filter(survey => this.getStartOfDayTimestamp(this.parseSurveyDate(survey.expiry_date)) >= todayStart);
  }

  /**
   * This function filters the surveys to find those that have already expired. It checks if the expiry date of each survey is 
   * before the current date.
   * @returns An array of surveys that have already expired.
   */
  filterPastSurveys() {
    const todayStart = this.getStartOfDayTimestamp(new Date());
    return this.surveys().filter(survey => this.getStartOfDayTimestamp(this.parseSurveyDate(survey.expiry_date)) < todayStart);
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
   * This function parses a survey date from a string or Date object. It handles both date-only strings (in the format "YYYY-MM-DD")
   * and full date strings.
   * @param value - The date value to parse, either as a string or a Date object.
   * @returns A Date object representing the parsed date.
   */
  private parseSurveyDate(value: string | Date): Date {
    if (value instanceof Date) {
      return value;
    }

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
  getFilterdSurveysByStateOrCategory() {
    const category = this.selectedCategory();
    const state = this.surveyState();
    const todayStart = this.getStartOfDayTimestamp(new Date());

    const byState = this.surveys().filter((survey) => {
      const expiryStart = this.getStartOfDayTimestamp(
        this.parseSurveyDate(survey.expiry_date)
      );
      return state === 'active'
        ? expiryStart >= todayStart
        : expiryStart < todayStart;
    });

    if (!category) return byState;
    return byState.filter((survey) => survey.category === category);
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
        id: 0,
        question_id: questionId,
        option_id: optionId
      };

      return newVote;
    });

    return [...votes, ...newVotes];
  }
   

}
