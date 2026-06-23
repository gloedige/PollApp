import { Component, Input, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox {
  optionId = input<number>(0);
  checked = input<boolean>(false);
  toggle = output<number>();

  questionId = input<string>('123');
  isCheckboxForMultipleOptions = input<boolean>(false);

  /**
   * This function is called when the checkbox state changes. It checks if the optionId is defined and then emits the optionId to notify the 
   * parent component about the change in checkbox state.
   * @returns - void
   */
  onChange() {
    if (this.optionId() === undefined) return;
    else {
      // this.checked.set(!this.checked());
      this.toggle.emit(this.optionId());
    }
  }

  

  
  control = new FormControl(false);
}
