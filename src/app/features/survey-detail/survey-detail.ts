import { Component, inject, Renderer2, signal } from '@angular/core';
import { Button } from "../../shared/components/button/button";
import {DOCUMENT} from "@angular/common";
import { QuestionOptionBlock } from '../components/question-option-block/question-option-block';

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
  selector: 'app-survey-detail',
  imports: [Button, QuestionOptionBlock],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  filteredOptions: Option[] = [];
  multipleOptions: boolean = false;
  numberOfQuestion: number = 0;
  order_letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'detail-page');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'detail-page');
  }

  getFilteredOptions(questionId: number) {
    this.filteredOptions = this.options().filter(option => option.question_id === questionId);
  }

  getStateOfMultipleOptions(questionId: number) {
    this.multipleOptions = this.questions().find(question => question.id === questionId)?.multiple_options ?? false;
    return this.multipleOptions;
  }

  getNumberOfQuestion(questionId: number) {
    this.numberOfQuestion = this.questions().findIndex(question => question.id === questionId) + 1;
    return this.numberOfQuestion;
  }

  getOrderLetter(index: number) {
    return this.order_letter[index] ?? '';
  }


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
