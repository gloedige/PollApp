import { FormControl, FormArray, FormGroup } from '@angular/forms';

export interface OptionFormValue {
    text: string;
}

export interface QuestionFormValue {
    title: string;
    multiple: boolean;
    options: OptionFormValue[];
}

export interface SurveyFormValue {
    survey_title: string;
    description: string;
    expiry_date: string | null;
    category: string;
    questions: QuestionFormValue[];
}

export interface OptionGroup extends FormGroup<{
    text: FormControl<string>;
}> {}

export interface QuestionGroup extends FormGroup<{
    title: FormControl<string>;
    multiple: FormControl<boolean>;
    options: FormArray<OptionGroup>;
}> {}

export interface SurveyForm extends FormGroup<{
    survey_title: FormControl<string>;
    description: FormControl<string>;
    expiry_date: FormControl<string>;
    category: FormControl<string>;
    questions: FormArray<QuestionGroup>;
}> {}