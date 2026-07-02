import { Injectable, signal, computed } from '@angular/core';
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey } from '../interfaces/survey';
import { Question } from '../interfaces/question';
import { Vote} from '../interfaces/vote';
import { Option } from '../interfaces/option';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  questions = signal<Question[]>([]);
  options = signal<Option[]>([]);
  votes = signal<Vote[]>([]);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    this.getAllVotes();
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
      this.options.set(options);
    } else {
      console.error(`Error fetching options:`, error);
    }
  }

  /**
   * This function retrieves all votes from the Supabase database and updates the votes signal with the fetched data.
   * It logs the fetched votes or any errors that occur during the fetch process.
   * @returns - A promise that resolves when the votes are fetched and the votes signal is updated.
   */
  async getAllVotes() {
    let { data: votes, error } = await this.supabase
    .from('votes')
    .select('*');
    if (votes) {
      this.votes.set(votes);
    } else {
      console.error(`Error fetching votes:`, error);
    }
  }

  /**
   * This function adds new votes to the Supabase database. It takes an array of votes as input and inserts them into the 'votes' table.
   * If the insertion is successful, it logs the added votes and refreshes the votes by calling getAllVotes(). If there's an error, it 
   * logs the error.
   * @param votes - An array of votes to be added to the database.
   */
  async addNewVotes(votes: Vote[]) {
    const { data, error } = await this.supabase
      .from('votes')
      .insert(votes);
    if (error) {
      console.error('Error adding new votes:', error);
    } else {
      console.log('New votes added:', data);
      this.getAllVotes(); // Refresh the votes after adding new ones
    }
  }

  /**
   * This function sets up real-time subscriptions to the surveys table in the Supabase database. It listens for INSERT, UPDATE, and 
   * DELETE events and updates the surveys signal accordingly when changes occur.
   * @returns - void
   */
  subscribeToSurveyChanges() {
    if (this.channels) return; 
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