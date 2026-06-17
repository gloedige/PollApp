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
  async getAllQuestionsBySurveyId(surveyId: number) {
    let { data: questions, error } = await this.supabase
    .from('questions')
    .select('*')
    .eq('survey_id', surveyId);
    if (questions) {
      console.log(`Fetched questions for survey ID ${surveyId}:`, questions);
      this.questions.set(questions);
    } else {
      console.error(`Error fetching questions for survey ID ${surveyId}:`, error);
    }
  }

  /**
   * This function retrieves all options from the Supabase database and updates the options signal with the fetched data. 
   * It logs the fetched options or any errors that occur during the fetch process.
   */
  async getAllOptions() {
    let { data: options, error } = await this.supabase
    .from('options')
    .select('*')
    if (options) {
      console.log(`Fetched options:`, options);
      this.options.set(options);
    } else {
      console.error(`Error fetching options:`, error);
    }
  }

  async getAllResultsByQuestionId(questionId: number) {
    let { data: results, error } = await this.supabase
    .from('results')
    .select('*')
    .eq('question_id', questionId);
    if (results) {
      console.log(`Fetched results for question ID ${questionId}:`, results);
      this.results.set(results);
    } else {
      console.error(`Error fetching results for question ID ${questionId}:`, error);
    }
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