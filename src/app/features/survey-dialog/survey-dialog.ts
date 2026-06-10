import { Component } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { CategoryMenu } from '../../shared/components/category-menu/category-menu';
import { DialogQuestionOptionBlock } from '../components/dialog-question-option-block/dialog-question-option-block';

type QuestionDraft = {
  clientId: string;
  id?: string;
  text: string;
  options: OptionDraft[];
};

type OptionDraft = {
  clientId: string;
  id?: string;
  questionClientId: string;
  questionId?: string;
  text: string;
};

@Component({
  selector: 'app-survey-dialog',
  imports: [Button, CategoryMenu, DialogQuestionOptionBlock],
  templateUrl: './survey-dialog.html',
  styleUrl: './survey-dialog.scss',
})
export class SurveyDialog {}
