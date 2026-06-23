import { Component, Input, input, output, signal } from '@angular/core';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';

@Component({
  selector: 'app-question-option',
  imports: [Checkbox],
  templateUrl: './question-option.html',
  styleUrl: './question-option.scss',
})
export class QuestionOption {
  optionText = input<string>('Option text');
  order_letter = input<string>('Order letter');
  optionId = input.required<number>();
  isSelected = input<boolean>(false);
  optionSelected = output<number>();
  isCheckboxForMultipleOptions = input<boolean>(false);

  /**
   * This function is called when the checkbox for an option is toggled. It emits the option ID of the toggled 
   * checkbox to notify the parent component about the selection change.
   * @param id - The ID of the option whose checkbox was toggled.
   */
  onCheckboxToggle(id: number) {
    this.optionSelected.emit(id);
  }

  /**
   * This function is called when the options are selected. It checks if the optionId is defined and then calls the onCheckboxToggle
   * function to handle the selection of the option.
   * @returns - void
   */
  onOptionsSelected() {
    if (this.optionId() === undefined) return;
     else {
      this.onCheckboxToggle(this.optionId());
    }
  }

}
  