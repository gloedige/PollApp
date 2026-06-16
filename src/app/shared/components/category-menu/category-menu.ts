import { Component, Input, input, signal, inject } from '@angular/core';
import { SurveyService } from '../../../features/services/survey-service';

@Component({
  selector: 'app-category-menu',
  imports: [],
  templateUrl: './category-menu.html',
  styleUrl: './category-menu.scss',
})
export class CategoryMenu {
  @Input() isMenuOpen = false;
  readonly text = input<string>('Button');
  readonly categoryTypes = ['Team Activities', 'Health & Wellness', 'Gaming & Entertainment', 'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation'];
  selectedCategory = signal<typeof this.categoryTypes[number] | null>(null);

  surveyService = inject(SurveyService);

  ngOnInit() {
    this.selectedCategory.set(this.surveyService.selectedCategory());
  }

  /**
   * This function toggles the state of the dropdown menu. It updates the isMenuOpen property to show or 
   * hide the menu and prevents the default action of the event.
   * @param event The event that triggered the toggle action.
   */
  toggleStateOfDropdownMenu(event: Event): void {
    this.isMenuOpen = !this.isMenuOpen;
    event.preventDefault();
  }

  /**
   * This function sets the selected category. It updates the selectedCategory signal with the chosen category.
   * @param category The category to be selected.
   */
  selectCategory(category: typeof this.categoryTypes[number]): void {
    this.selectedCategory.set(category);
    this.surveyService.selectedCategory.set(category);
    this.isMenuOpen = false;
  }
}
  