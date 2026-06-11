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

  async getAllSurveys() {
    let { data: surveys, error } = await this.supabase
    .from('surveys')
    .select('*');
    if (!surveys) return;
    this.surveys.set(surveys);
    console.log('Fetched surveys:', surveys);
    this.subscribeToSurveyChanges();
  }

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

  ngOnDestroy() {
    if (this.channels) {
      this.supabase.removeChannel(this.channels);
    }
  }

}