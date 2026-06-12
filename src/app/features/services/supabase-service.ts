import { Injectable, signal } from '@angular/core';
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey } from '../interfaces/survey';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
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
  endingSoonSurveys = signal<Survey[]>([]);

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
    this.subscribeToSurveyChanges();
  }

  /**
   * This function retrieves surveys that are ending soon (within the next 3 days) from the Supabase database and updates the 
   * endingSoonSurveys signal with the fetched data.
   * @returns - A promise that resolves when the surveys are fetched and the endingSoonSurveys signal is updated.
   */
  async getFilteredSurveysEndingSoon() {
    const today = new Date().toISOString().slice(0, 10);
    const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString().slice(0, 10);

    let { data: surveys, error } = await this.supabase
    .from('surveys')
    .select('*')
    .gte('expiry_date', today)
    .lte('expiry_date', threeDaysLater)
    .order('expiry_date', { ascending: true })
    .limit(6);
    if (surveys) {
      this.endingSoonSurveys.set(surveys);
      console.log('Fetched ending soon surveys:', surveys);
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