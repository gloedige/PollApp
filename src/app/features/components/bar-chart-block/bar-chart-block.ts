import { Component, signal, inject, input, output, computed } from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';
import { SupabaseService } from '../../services/supabase-service';
import { SurveyService } from '../../services/survey-service';
import { Vote } from '../../interfaces/vote';

@Component({
  selector: 'app-bar-chart-block',
  imports: [],
  templateUrl: './bar-chart-block.html',
  styleUrl: './bar-chart-block.scss',
})
export class BarChartBlock {
  surveyDetails = inject(SurveyDetail);
  dbService = inject(SupabaseService);
  surveyService = inject(SurveyService);
  optionId = input<number>(0);
  questionId = input<number>(0);
  order_letter = input<string>('');

  readonly allVotes = computed(() => [...this.dbService.votes(), ...this.surveyService.votesOfActiveSurvey()]);
  readonly votesForQuestion = computed(() => this.allVotes().filter(vote => vote.question_id === this.questionId()));
  readonly votesForOption = computed(() => this.votesForQuestion().filter(vote => vote.option_id === this.optionId()));
  readonly percentage = computed(() => this.calculatePercentageOfVotes(this.votesForOption().length, this.votesForQuestion().length));
  
  
  /**
   * This function calculates the percentage of votes for a specific option based on the number of votes for that option and the total 
   * number of votes for the corresponding question.
   * @param numberOfVotesForOption - The number of votes for the specific option.
   * @param totalVotesForQuestion - The total number of votes for the corresponding question.
   * @returns - The percentage of votes for the option.
   */
  calculatePercentageOfVotes(numberOfVotesForOption: number, totalVotesForQuestion: number): number {
    if (totalVotesForQuestion === 0) return 0;
    return (numberOfVotesForOption / totalVotesForQuestion) * 100;
  }
  
}
