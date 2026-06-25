import { Component, input} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox{
  optionId = input<number>(0);
  questionId = input<string>('123');
  isCheckboxForMultipleOptions = input<boolean>(false);

  control = input.required<FormControl<boolean>>();

 

  

  
}
