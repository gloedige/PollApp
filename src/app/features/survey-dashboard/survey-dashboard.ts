import { SurveyCard } from '../components/survey-card/survey-card';
import { ChangeDetectionStrategy, Component, computed, signal, Input, inject, Renderer2 } from '@angular/core';
import { Survey } from '../interfaces/survey';
import { Button } from '../../shared/components/button/button';
import {DOCUMENT} from "@angular/common";
import { SurveyDialog } from '../survey-dialog/survey-dialog';
import { SupabaseService } from '../services/supabase-service';
import { SurveyService } from '../services/survey-service';
import { CategoryMenu } from '../../shared/components/category-menu/category-menu';

@Component({
  selector: 'app-survey-dashboard',
  imports: [SurveyCard, Button, SurveyDialog, CategoryMenu],
  templateUrl: './survey-dashboard.html',
  styleUrl: './survey-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyDashboard {
  @Input() isMenuOpen = false;
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly dbService = inject(SupabaseService);
  readonly surveyService = inject(SurveyService);
  
  readonly surveys = this.surveyService.surveys;
  readonly endingSoonSurveys = this.surveyService.endingSoonSurveys;
  readonly filteredSurveys = this.surveyService.visibleSurveys;

  buttonIsActive: boolean = true;

  readonly emptySurvey: Survey = {
    id: 0,
    title: 'No survey ending soon!',
    expiry_date: '',
    description: '',
  };

  
  /**
   * This function is called when the component is initialized. It adds a CSS class to the body element to apply 
   * specific styles for the survey dashboard page. It also calls the getAllSurveys() method to fetch all surveys 
   * from the database.
   * @returns - void
   */
  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'dashboard-page');
    this.dbService.getAllSurveys();
    this.dbService.subscribeToSurveyChanges();
  }

  /**
   * This function is called when the component is destroyed. It removes the CSS class from the body element that was added 
   * in ngOnInit() to clean up the styles.
   */
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'dashboard-page');
  }

  /**
   * This function toggles the state of the dropdown menu. It updates the isMenuOpen property to show or hide the menu.
   */
  toggleStateOfDropdownMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * This function sets the survey state to 'active' in the SurveyService, which triggers the filtering of surveys to show only those
   * that are currently active. It also updates the buttonIsActive property to true, which can be used to visually indicate 
   * that the "Active Surveys" button is active.
   */
  showActiveSurveys() {
    this.surveyService.surveyState.set('active');
    this.buttonIsActive = true;
  }

  /**
   * This function sets the survey state to 'past' in the SurveyService, which triggers the filtering of surveys to show only 
   * those that have already expired. It also updates the buttonIsActive property to false, which can be used to visually indicate 
   * that the "Past Surveys" button is active.
   */
  showPastSurveys() {
    this.surveyService.surveyState.set('past');
    this.buttonIsActive = false;
  }

}
