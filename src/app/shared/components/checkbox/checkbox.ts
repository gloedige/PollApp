import { Component, Input, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox {
  optionId = input.required<number>();
  checked = input<boolean>(false);
  toggle = output<number>();

  // @Input() questionId: string = '123';
  isCheckboxForMultipleOptions = input<boolean>(false);

  onChange() {
    if (this.optionId() === undefined) return;
    else {
      // this.checked.set(!this.checked());
      this.toggle.emit(this.optionId());
    }
  }



  
  control = new FormControl(false);
}
