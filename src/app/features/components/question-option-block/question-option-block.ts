import { Component, signal } from '@angular/core';
import { QuestionOption } from '../question-option/question-option';

type Question = {
    id: number;
    question: string;
    survey_id: number;
    multiple_options: boolean;
}
type Option = {
    id: number;
    question_id: number;
    option_text: string;
    option_selected: boolean;
}

@Component({
  selector: 'app-question-option-block',
  imports: [QuestionOption],
  templateUrl: './question-option-block.html',
  styleUrl: './question-option-block.scss',
})


export class QuestionOptionBlock {
    readonly questions = signal<Question[]>([
    {
      id: 1,
      question: 'Let\'s plan the next team event together',
      survey_id: 1,
      multiple_options: true
    },
    {
      id: 2,
      question: 'How should we improve our weekly stand-up?',
      survey_id: 2,
      multiple_options: false
    },
    {
      id: 3,
      question: 'Select topics for our monthly knowledge sharing sessions',
      survey_id: 3,
      multiple_options: true
    },
  ]);
  readonly options = signal<Option[]>([
    {
        id: 1,
        question_id: 1,
        option_text: 'Go-karting',
        option_selected: false
    },
    {
        id: 2,
        question_id: 1,
        option_text: 'Escape room',
        option_selected: false
    },
    {
        id: 3,
        question_id: 1,
        option_text: 'Cooking class',
        option_selected: false
    },
    {
        id: 4,
        question_id: 2,
        option_text: 'Use a timer to keep updates concise',
        option_selected: false
    },
    {
        id: 5,
        question_id: 2,
        option_text: 'Have a rotating facilitator',
        option_selected: false
    },
    {
        id: 6,
        question_id: 2,
        option_text: 'Focus on blockers and progress',
        option_selected: false
    },
    {
        id: 7,
        question_id: 3,
        option_text: 'Time management techniques',
        option_selected: false
    },
    {
        id: 8,
        question_id: 3,
        option_text: 'Effective communication',
        option_selected: false
    },
    {
        id: 9,
        question_id: 3,
        option_text: 'Stress management',
        option_selected: false
    },
  ]); 
}
