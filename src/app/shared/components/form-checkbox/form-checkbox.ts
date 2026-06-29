import { Component, input} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
})
export class FormCheckbox{
  optionId = input<number>(0);
  questionId = input<string>('123');
  isCheckboxForMultipleOptions = input<boolean>(false);

  checkBoxControl = input.required<FormControl<boolean>>();

 

  

  
}
