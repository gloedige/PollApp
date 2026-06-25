import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ui-checkbox',
  imports: [],
  templateUrl: './ui-checkbox.html',
  styleUrl: './ui-checkbox.scss',
})
export class UiCheckbox {
  optionId = input<number>(0);
  checked = input<boolean>(false);
  toggle = output<number>();


   /**
   * This function is called when the checkbox state changes. It checks if the optionId is defined and then emits the optionId to notify the 
   * parent component about the change in checkbox state.
   * @returns - void
   */
  onChange(): void {
    if (this.optionId() === undefined) return;
    else {
      // this.checked.set(!this.checked());
      this.toggle.emit(this.optionId());
    }
  }


}
