import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './features/services/supabase-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Poll_App');
  dbService = inject(SupabaseService);

  
}
