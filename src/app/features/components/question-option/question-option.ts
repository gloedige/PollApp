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

  onCheckboxToggle(id: number) {
    this.optionSelected.emit(id);
  }

  onOptionsSelected() {
    if (this.optionId() === undefined) return;
     else {
      this.onCheckboxToggle(this.optionId());
    }
  }

}
  