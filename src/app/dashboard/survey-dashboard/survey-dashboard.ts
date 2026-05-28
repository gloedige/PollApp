import { SurveyCard } from '../components/survey-card/survey-card';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Survey } from '../interfaces/survey';

@Component({
  selector: 'app-survey-dashboard',
  imports: [SurveyCard],
  templateUrl: './survey-dashboard.html',
  styleUrl: './survey-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyDashboard {
  readonly surveys = signal<Survey[]>([
    {
      id: 1,
      title: 'Let\'s plan the next team event together',
      expiry_date: '2026-06-02',
      description: 'Vote for activities, dates, and locations for the next team event.',
      category: 'Team activities',
      state: 'ending_soon',
    },
    {
      id: 2,
      title: 'How should we improve our weekly stand-up?',
      expiry_date: '2026-06-10',
      description: 'Share ideas to make our weekly stand-up shorter, clearer, and more useful.',
      category: 'Work culture',
      state: 'active',
    },
  ]);
  readonly endingSoonSurvey = computed(() => this.surveys()[0] ?? null);
}
