import { Component, signal, inject, input, computed } from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';
import { SupabaseService } from '../../services/supabase-service';
import { SurveyService } from '../../services/survey-service';

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
  numberOfVotesForOption = signal<number>(0);
  totalVotesForQuestion = signal<number>(0);
  percentageOfVotes = computed(() => this.calculatePercentageOfVotes(this.numberOfVotesForOption(), this.totalVotesForQuestion()));
  isOptionVoted = computed(() => this.isCurrentOptionVoted());
  
  ngOnInit() {
    this.dbService.getAllVotesByQuestionId(this.questionId()).then(() => {
      this.numberOfVotesForOption.set(this.dbService.votes().filter(result => result.option_id === this.optionId() && result.question_id === this.questionId()).length);
      this.totalVotesForQuestion.set(this.dbService.votes().filter(result => result.question_id === this.questionId()).length);
    });
    
  }
  
  //TODO: die Berechnung ist falsch. Es muss für alle Optionen einer Frage geprüft werden.
  calculatePercentageOfVotes(numberOfVotesForOption: number, totalVotesForQuestion: number): number {
    if (totalVotesForQuestion === 0) return 0;
    if (this.isOptionVoted()) {
      return ((numberOfVotesForOption + 1) / (totalVotesForQuestion + 1)) * 100;
    } else {
      return (numberOfVotesForOption / totalVotesForQuestion) * 100;
    }
  }
  
  isCurrentOptionVoted(){
    let doesExist = false;
    doesExist = this.surveyService.surveyVotes().some(vote => vote.option_id === this.optionId() && vote.question_id === this.questionId());
    console.log('Is current option voted? ', doesExist);
    return doesExist;
  }
}
