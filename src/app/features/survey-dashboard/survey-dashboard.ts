import { SurveyCard } from '../components/survey-card/survey-card';
import { ChangeDetectionStrategy, Component, computed, signal, Input } from '@angular/core';
import { Survey } from '../interfaces/survey';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-survey-dashboard',
  imports: [SurveyCard, Button],
  templateUrl: './survey-dashboard.html',
  styleUrl: './survey-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyDashboard {
  @Input() isMenuOpen = false;
  readonly surveys = signal<Survey[]>([
    {
      id: 1,
      title: 'Let\'s plan the next team event together',
      expiry_date: '2026-06-02',
      description: 'Vote for activities, dates, and locations for the next team event.',
      category: 'Team activities'
    },
    {
      id: 2,
      title: 'How should we improve our weekly stand-up?',
      expiry_date: '2026-06-10',
      description: 'Share ideas to make our weekly stand-up shorter, clearer, and more useful.',
      category: 'Work culture'
    },
    {
      id: 3,
      title: 'Select topics for our monthly knowledge sharing sessions',
      expiry_date: '2026-05-30',
      description: 'Help us choose topics for our monthly knowledge sharing sessions.',
      category: 'Professional development'
    },
  ]);
  readonly endingSoonSurvey = computed(() => this.surveys()[0] ?? null);

  toggleStateOfDropdownMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
