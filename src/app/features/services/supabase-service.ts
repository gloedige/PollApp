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

  async getAllSurveys() {
    let { data: surveys, error } = await this.supabase
    .from('surveys')
    .select('*');
    if (!surveys) return;
    this.surveys.set(surveys);
    console.log('Fetched surveys:', surveys);
    // this.subscribeToSurveyChanges(); 
  }

}