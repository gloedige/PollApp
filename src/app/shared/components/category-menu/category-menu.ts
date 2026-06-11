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

  toggleStateOfDropdownMenu(event: Event): void {
    this.isMenuOpen = !this.isMenuOpen;
    event.preventDefault();
  }
}
