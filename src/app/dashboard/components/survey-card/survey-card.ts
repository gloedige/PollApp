import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Survey, SurveyType } from '../../interfaces/survey';

@Component({
  selector: 'app-survey-card',
  imports: [CommonModule],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCard {
  @Input({required: true}) survey!: Survey;
  @Input() listType: SurveyType = 'active';

}
