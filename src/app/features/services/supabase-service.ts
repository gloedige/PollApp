import { Injectable, signal, computed } from '@angular/core';
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey } from '../interfaces/survey';
import { Question } from '../interfaces/question';
import { Result } from '../interfaces/result';
import { Option } from '../interfaces/option';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  questions = signal<Question[]>([]);
  options = signal<Option[]>([]);
  results = signal<Result[]>([]);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  getTodos() {
    return this.supabase.from('todos').select('*');
  }

  channels:  RealtimeChannel | undefined;
  surveys = signal<Survey[]>([]);
  endingSoonSurveys = computed(this.getFilteredSurveysEndingSoon.bind(this));

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

  /**
   * This function retrieves all surveys from the Supabase database and updates the surveys signal with the fetched data.
   * It also subscribes to real-time changes for the surveys table.
   * @returns - A promise that resolves when the surveys are fetched and the subscription is set up.
   */
  async getAllSurveys() {
    let { data: surveys, error } = await this.supabase
    .from('surveys')
    .select('*');
    if (!surveys) return;
    this.surveys.set(surveys);
    console.log('Fetched surveys:', surveys);
  }

  /**
   * This function retrieves questions for a specific survey from the Supabase database based on the provided survey ID. It 
   * returns an array of questions associated with that survey.
   * @param surveyId - The ID of the survey for which to fetch questions.
   * @returns - A promise that resolves to an array of questions for the specified survey.
   */
  async getQuestionsBySurveyId(surveyId: number) {
    let { data: questions, error } = await this.supabase
    .from('questions')
    .select('*')
    .eq('survey_id', surveyId);
    if (questions) {
      console.log(`Fetched questions for survey ID ${surveyId}:`, questions);
      return questions;
    }
    return [];
  }

  /**
   * This function sets up real-time subscriptions to the surveys table in the Supabase database. It listens for INSERT, UPDATE, and 
   * DELETE events and updates the surveys signal accordingly when changes occur.
   * @returns - void
   */
  subscribeToSurveyChanges() {
  this.channels = this.supabase
    .channel('surveys')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'surveys' },
      (payload) => {
        this.surveys.update(list => [...list, payload.new as Survey]);
      }
    )
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'surveys' },
      (payload) => {
        this.surveys.update(list =>
          list.map(s => s.id === (payload.new as Survey).id ? payload.new as Survey : s)
        );
      }
    )
    .on('postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'surveys' },
      (payload) => {
        this.surveys.update(list =>
          list.filter(s => s.id !== (payload.old as Survey).id)
        );
      }
    )
    .subscribe();
  }

  /**
   * This function is called when the component is destroyed. It checks if there are any active channels for real-time subscriptions and 
   * removes them to clean up resources.
   */
  ngOnDestroy() {
    if (this.channels) {
      this.supabase.removeChannel(this.channels);
    }
  }

}