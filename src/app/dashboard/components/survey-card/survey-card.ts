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

  /**
   * This function calculates the number of days until the survey expires based on the current date and the survey's expiry date.
   * @returns - The number of days until the survey expires, or null if there is no expiry date.
   */
  private getDaysUntilExpiry(): number | null {
    if (!this.survey.expiry_date) {
      return null;
    }
    const today = new Date();
    const expiryDate = new Date(this.survey.expiry_date);
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * This getter returns a string that indicates how many days are left until the survey expires. It uses the getDaysUntilExpiry() 
   * function to calculate the number of days and formats the string accordingly.
   * @returns - A string indicating the time until the survey expires, such as "Ends today", "Ends in 1 day", "Ends in X days", 
   * or "No expiry date".
   */
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

  /**
   * This getter returns a boolean indicating whether the survey is ending soon. A survey is considered ending soon if it has 3 
   * or fewer days left until its expiry date.
   * @returns - True if the survey is ending soon, false otherwise.
   */
  get isEndingSoon(): boolean {
    const daysUntilExpiry = this.getDaysUntilExpiry();
    return daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
  }

  /**
   * This getter returns a boolean indicating whether the survey is currently active. A survey is considered active if it has not yet expired.
   * @returns - True if the survey is active, false otherwise.
   */
  get isActive(): boolean {
    const daysUntilExpiry = this.getDaysUntilExpiry();
    return daysUntilExpiry !== null && daysUntilExpiry >= 0;
  }

  /**
   * This getter returns a boolean indicating whether the survey has expired. A survey is considered expired if its expiry date has passed.
   * @returns - True if the survey has expired, false otherwise.
   */
  get isExpired(): boolean {
    const daysUntilExpiry = this.getDaysUntilExpiry();
    return daysUntilExpiry !== null && daysUntilExpiry < 0;
  }
}
