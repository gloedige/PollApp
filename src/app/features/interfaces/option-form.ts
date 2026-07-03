import { FormGroup, FormControl } from '@angular/forms';

export interface OptionGroup extends FormGroup {
    text: FormControl<string>;
}
