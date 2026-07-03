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
