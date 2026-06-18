import { Component, signal, inject, input } from '@angular/core';
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
  optionId = input<number>(0);
  questionId = input<number>(0);
  order_letter = input<string>('');
  numberOfVotesForOption: number = 0;
  totalVotesForQuestion: number = 0;
  percentageOfVotes = signal<number>(0);

  ngOnInit() {
    this.dbService.getAllVotesByQuestionId(this.questionId()).then(() => {
      this.numberOfVotesForOption = this.dbService.votes().filter(result => result.option_id === this.optionId() && result.question_id === this.questionId()).length;
      this.totalVotesForQuestion = this.dbService.votes().filter(result => result.question_id === this.questionId()).length;
      this.percentageOfVotes.set(this.calculatePercentageOfVotes(this.numberOfVotesForOption, this.totalVotesForQuestion));
      this.percentageOfVotes.set(parseFloat(this.percentageOfVotes().toFixed(0)));
    });
    
  }

  calculatePercentageOfVotes(numberOfVotesForOption: number, totalVotesForQuestion: number): number {
    if (totalVotesForQuestion === 0) return 0;
    return (numberOfVotesForOption / totalVotesForQuestion) * 100;
  }
}
