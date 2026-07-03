import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { OptionGroup } from './option-form';

export interface QuestionGroup extends FormGroup {
    title: FormControl<string>;
    multiple: FormControl<boolean>;
    options: FormArray<OptionGroup>;
}
