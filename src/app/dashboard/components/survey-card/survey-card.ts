import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Survey } from '../../interfaces/survey';

@Component({
  selector: 'app-survey-card',
  imports: [CommonModule],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCard {
  @Input({required: true}) survey!: Survey;
  @Input() showsEndingSoonCard = false;
  
  private getDaysUntilExpiry(): number | null {
    if (!this.survey.expiry_date) {
      return null;
    }
    const today = new Date();
    const expiryDate = new Date(this.survey.expiry_date);
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  get endsInText(): string {
    const daysUntilExpiry = this.getDaysUntilExpiry();
    if (daysUntilExpiry === null) {
      return 'No expiry date';
    } else if (daysUntilExpiry === 0) {
      return 'Ends today';
    } else if (daysUntilExpiry === 1) {
      return 'Ends in 1 day';
    } else {
      return `Ends in ${daysUntilExpiry} days`;
    }
  }
}
