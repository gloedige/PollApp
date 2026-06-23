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

  // totalVotesForQuestion = computed(() => this.surveyService.completedVotesOfActiveSurvey().filter(vote => vote.question_id === this.questionId()).length);
  // countOfVotesForOption = computed(() => this.surveyService.votesOfActiveSurvey().filter(vote => vote.option_id === this.optionId() && vote.question_id === this.questionId()).length);
  // percentageOfVotes = computed(() => this.calculatePercentageOfVotes(this.countOfVotesForOption(), this.totalVotesForQuestion()));
  // isOptionVoted = computed(() => this.isCurrentOptionVoted());

  readonly allVotes = computed(() => [...this.dbService.votes(), ...this.surveyService.votesOfActiveSurvey()]);
  readonly votesForQuestion = computed(() => this.allVotes().filter(vote => vote.question_id === this.questionId()));
  readonly votesForOption = computed(() => this.votesForQuestion().filter(vote => vote.option_id === this.optionId()));
  readonly percentage = computed(() => this.calculatePercentageOfVotes(this.votesForOption().length, this.votesForQuestion().length));
  
  ngOnInit() {
    // this.countOfVotesForOption.set(this.dbService.votes().filter(result => result.option_id === this.optionId() && result.question_id === this.questionId()).length);  
    
  }
  
  //TODO: die Berechnung ist falsch. Es muss für alle Optionen einer Frage geprüft werden.
  calculatePercentageOfVotes(numberOfVotesForOption: number, totalVotesForQuestion: number): number {
    if (totalVotesForQuestion === 0) return 0;
    return (numberOfVotesForOption / totalVotesForQuestion) * 100;
    // if (this.isOptionVoted()) {
    //   return ((numberOfVotesForOption + 1) / (totalVotesForQuestion + 1)) * 100;
    // } else {
    // }
  }
  
  // isCurrentOptionVoted(){
  //   let doesExist = false;
  //   doesExist = this.surveyService.votesOfActiveSurvey().some(vote => vote.option_id === this.optionId() && vote.question_id === this.questionId());
  //   // console.log('Is current option voted? ', doesExist);
  //   return doesExist;
  // }
}
