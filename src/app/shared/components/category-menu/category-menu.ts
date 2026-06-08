import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-menu',
  imports: [],
  templateUrl: './category-menu.html',
  styleUrl: './category-menu.scss',
})
export class CategoryMenu {
  @Input() isMenuOpen = false;

  toggleStateOfDropdownMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
