export interface OptionCreateDto {
  option_text: string;
}

export interface QuestionCreateDto {
  question: string;
  multiple_options: boolean;
  options: OptionCreateDto[];
}

export interface SurveyCreateDto {
  title: string;
  description: string;
  expiry_date: string;
  category: string;
  questions: QuestionCreateDto[];
}