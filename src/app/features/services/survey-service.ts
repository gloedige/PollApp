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
  activeSurveys = computed(() => this.surveys().filter(survey => new Date(survey.expiry_date) > new Date()));
  pastSurveys = computed(() => this.surveys().filter(survey => new Date(survey.expiry_date) <= new Date()));

  constructor() {
    
  }

    /**
   * This function filters the surveys to find those that are ending soon. It checks if the expiry date of each survey 
   * is within the next three days.
   * @returns - An array of surveys that are ending soon.
   */
  getFilteredSurveysEndingSoon() {
    return this.surveys().filter(survey => {
      const today = new Date();
      const expiryDate = new Date(survey.expiry_date);
      const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      return expiryDate >= today && expiryDate <= threeDaysLater;
    });
  }

}
