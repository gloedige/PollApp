import { Component, input, output, signal, model } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Checkbox,
      multi: true
    }
  ]
})
export class Checkbox implements ControlValueAccessor {
  optionId = input<number>(0);
  checked = input<boolean>(false);
  toggle = output<number>();

  questionId = input<string>('123');
  isCheckboxForMultipleOptions = input<boolean>(false);
  // formGroupCheckbox = input<FormGroup>();

  onChangeFn: (value: boolean) => void = () => {};
  readonly value = model(() => this.checked());

  writeValue(value: boolean): void {
    
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    // Implement if needed
  }

  constructor() {}

  /**
   * This function is called when the checkbox state changes. It checks if the optionId is defined and then emits the optionId to notify the 
   * parent component about the change in checkbox state.
   * @returns - void
   */
  onChange(event: Event): void {
    if (this.optionId() === undefined) return;
    else {
      // this.checked.set(!this.checked());
      this.toggle.emit(this.optionId());
      const inputElement = event?.target as HTMLInputElement;
      this.onChangeFn(inputElement.checked);
    }
  }

  

  
}
