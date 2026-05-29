import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  primary: boolean = true;

  setPrimary(isPrimary: boolean) {
    this.primary = isPrimary;
  }
}
