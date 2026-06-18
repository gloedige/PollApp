import { Component, Input, signal, inject } from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';
import { SupabaseService } from '../../services/supabase-service';

@Component({
  selector: 'app-bar-chart-block',
  imports: [],
  templateUrl: './bar-chart-block.html',
  styleUrl: './bar-chart-block.scss',
})
export class BarChartBlock {
  surveyDetails = inject(SurveyDetail);
  dbService = inject(SupabaseService);
  @Input() optionId = 0;
  @Input() questionId = 0;
  @Input() order_letter = '';
  numberOfVotesForOption: number = 0;
  totalVotesForQuestion: number = 0;
  percentageOfVotes = signal<number>(0);

  ngOnInit() {
    this.dbService.getAllVotesByQuestionId(this.questionId).then(() => {
      this.numberOfVotesForOption = this.dbService.votes().filter(result => result.option_id === this.optionId && result.question_id === this.questionId).length;
      this.totalVotesForQuestion = this.dbService.votes().filter(result => result.question_id === this.questionId).length;
      this.percentageOfVotes.set(this.calculatePercentageOfVotes(this.numberOfVotesForOption, this.totalVotesForQuestion));
      this.percentageOfVotes.set(parseFloat(this.percentageOfVotes().toFixed(0)));
    });
    
  }

  calculatePercentageOfVotes(numberOfVotesForOption: number, totalVotesForQuestion: number): number {
    if (totalVotesForQuestion === 0) return 0;
    return (numberOfVotesForOption / totalVotesForQuestion) * 100;
  }
}
