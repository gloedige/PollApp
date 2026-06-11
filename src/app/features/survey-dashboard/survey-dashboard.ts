import { SurveyCard } from '../components/survey-card/survey-card';
import { ChangeDetectionStrategy, Component, computed, signal, Input, inject, Renderer2 } from '@angular/core';
import { Survey } from '../interfaces/survey';
import { Button } from '../../shared/components/button/button';
import { CategoryMenu } from '../../shared/components/category-menu/category-menu';
import {DOCUMENT} from "@angular/common";
import { SurveyDialog } from '../survey-dialog/survey-dialog';
import { SupabaseService } from '../services/supabase-service';

@Component({
  selector: 'app-survey-dashboard',
  imports: [SurveyCard, Button, CategoryMenu, SurveyDialog],
  templateUrl: './survey-dashboard.html',
  styleUrl: './survey-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyDashboard {
  @Input() isMenuOpen = false;
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly dbService = inject(SupabaseService);
  
  readonly surveys = this.dbService.surveys;
  readonly endingSoonSurveys = this.dbService.endingSoonSurveys;
  
  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'dashboard-page');
    this.dbService.getAllSurveys();
    this.dbService.getFilteredSurveysEndingSoon();
    
  }


  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'dashboard-page');
  }

  toggleStateOfDropdownMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
