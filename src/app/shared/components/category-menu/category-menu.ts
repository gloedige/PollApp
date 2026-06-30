import { Component, Input, input, signal, inject } from '@angular/core';
import { SurveyService } from '../../../features/services/survey-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-menu',
  imports: [ReactiveFormsModule],
  templateUrl: './category-menu.html',
  styleUrl: './category-menu.scss',
})
export class CategoryMenu {
  @Input() isMenuOpen = false;
  @Input() isCategorySelected = false;
  readonly text = input<string>('Button');
  readonly categoryTypes = ['Team Activities', 'Health & Wellness', 'Gaming & Entertainment', 'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation', ''];
  selectedCategory = signal<typeof this.categoryTypes[number] | null>(null);
  private readonly surveyServiceMenu = inject(SurveyService);

  categoryControl = input<FormControl<string> | null>(null);

  get categoryTitleInvalid(): boolean {
    const categoryControl = this.categoryControl();
    return categoryControl ? categoryControl.invalid && (categoryControl.touched || this.surveyServiceMenu.submitted()) : false;
  }

  ngOnInit() {
    this.selectedCategory.set(this.surveyServiceMenu.selectedCategory());
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
    this.surveyServiceMenu.selectedCategory.set(category);
    this.isCategorySelected = true;

    const control = this.categoryControl();
    if (control) {
      control.setValue(category);
      control.markAsDirty();
      control.markAsTouched();
    }
    this.isMenuOpen = false;
  }
  
}
  