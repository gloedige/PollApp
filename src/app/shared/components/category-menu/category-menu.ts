import { Component, input, signal, inject, computed } from '@angular/core';
import { SurveyService } from '../../../features/services/survey-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getValidationMessage } from '../../utils/validation-messages.util';
import { CategoryTypes } from '../../../features/interfaces/category-types';


@Component({
  selector: 'app-category-menu',
  imports: [ReactiveFormsModule],
  templateUrl: './category-menu.html',
  styleUrl: './category-menu.scss',
})
export class CategoryMenu {
  isMenuOpen = signal<boolean>(false);
  isCategorySelected = signal<boolean>(false);
  readonly text = input<string>('Button');
  readonly surveyServiceProvider = inject(SurveyService);
  categoryControl = input<FormControl<string> | null>(null);
  categoryTypesArray = computed(() => this.getArrayOfCategoryTypes());

  /**
   * This getter checks if the category title is invalid. It retrieves the 'categoryControl' input and checks if it is invalid and has been touched 
   * or if the survey has been submitted.
   * @returns A boolean indicating whether the category title is invalid.
   */
  get categoryTitleInvalid(): boolean {
    const categoryControl = this.categoryControl();
    return categoryControl ? categoryControl.invalid && (categoryControl.touched || this.surveyServiceProvider.submitted()) : false;
  }

  /**
   * This lifecycle hook initializes the component by setting the selected category from the SurveyService. It ensures that the selected category 
   * is synchronized with the service's state when the component is initialized. It is called once after the component's inputs have been initialized.
   * @returns void
   */
  ngOnInit() {
    this.surveyServiceProvider.selectedCategory.set(this.categoryTypesArray()[6]);
  }

  /**
   * This function returns an array of predefined category types. It is used to populate the category menu with available options for selection.
   * @returns - An array of category types defined in the CategoryTypes type.
   */
  getArrayOfCategoryTypes(): CategoryTypes {
    return [
      'Team Activities',
      'Health & Wellness',
      'Gaming & Entertainment',
      'Education & Learning',
      'Lifestyle & Preferences',
      'Technology & Innovation',
      ''
    ] as CategoryTypes;
  }


  /**
   * This function toggles the state of the dropdown menu. It updates the isMenuOpen property to show or 
   * hide the menu and prevents the default action of the event.
   * @param event The event that triggered the toggle action.
   */
  toggleStateOfDropdownMenu(event: Event): void {
    this.isMenuOpen.set(!this.isMenuOpen());
    event.preventDefault();
  }

  /**
   * This function sets the selected category. It updates the selectedCategory signal with the chosen category.
   * @param category The category to be selected.
   */
  selectCategory(category: CategoryTypes[number]): void {
    this.surveyServiceProvider.selectedCategory.set(category);
    this.isCategorySelected.set(true);

    const control = this.categoryControl();
    if (control) {
      control.setValue(category);
      control.markAsDirty();
      control.markAsTouched();
    }
    this.isMenuOpen.set(false);
  }

  /**
   * This function resets the selected category. It clears the selectedCategory signal, resets the SurveyService's selectedCategory,
   * and updates the category control to an empty value. It also marks the control as dirty and touched, and closes the dropdown menu.
   * @returns void
   */
  resetCategorySelection(): void {
    this.surveyServiceProvider.selectedCategory.set(null);
    this.isCategorySelected.set(false);

    const control = this.categoryControl();
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.markAsTouched();
    }
    this.isMenuOpen.set(false);
  }

  /**
   * This function retrieves the validation error message for the category control. It checks if the control is invalid and has been touched 
   * or if the survey has been submitted. If so, it returns the appropriate validation message using the getValidationMessage utility function.
   * @param controlName The name of the control for which to retrieve the error message.
   * @returns The validation error message, or null if the control is valid or has not been touched.
   */
  getInputErrorMessage(controlName: string): string | null {
      const control = this.categoryControl();
      const shouldShow = !!control && (control.touched || this.surveyServiceProvider.submitted());
      if (!shouldShow) return null;
  
      return getValidationMessage(control, controlName);
  }
  
}
  