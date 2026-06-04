import { Component, Input, signal, inject } from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';

@Component({
  selector: 'app-bar-chart-block',
  imports: [],
  templateUrl: './bar-chart-block.html',
  styleUrl: './bar-chart-block.scss',
})
export class BarChartBlock {
  surveyDetails = inject(SurveyDetail);
  @Input() optionId = 0;
  @Input() order_letter = '';
  // readonly order_letter = signal<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  ngOnInit() {
    // this.order_letter.set(this.surveyDetails.order_letter);
  }
}
