import { Component } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { CategoryMenu } from '../../shared/components/category-menu/category-menu';

@Component({
  selector: 'app-survey-dialog',
  imports: [Button, CategoryMenu],
  templateUrl: './survey-dialog.html',
  styleUrl: './survey-dialog.scss',
})
export class SurveyDialog {}
