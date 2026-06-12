import { Component, Input, input } from '@angular/core';

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

  /**
   * This function toggles the state of the dropdown menu. It updates the isMenuOpen property to show or 
   * hide the menu and prevents the default action of the event.
   * @param event The event that triggered the toggle action.
   */
  toggleStateOfDropdownMenu(event: Event): void {
    this.isMenuOpen = !this.isMenuOpen;
    event.preventDefault();
  }
}
