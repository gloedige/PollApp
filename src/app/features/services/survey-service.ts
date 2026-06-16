import { Injectable, signal, inject, computed } from '@angular/core';
import { Survey } from '../interfaces/survey';
import { SupabaseService } from './supabase-service';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  surveyList = signal<Survey[]>([]);
  surveyDetail = signal<Survey | null>(null);
  private readonly dbService = inject(SupabaseService);
  surveys = this.dbService.surveys;
  endingSoonSurveys = computed(this.getFilteredSurveysEndingSoon.bind(this));
  activeSurveys = computed(() => this.filterActiveSurveys());
  pastSurveys = computed(() => this.filterPastSurveys());


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

}
