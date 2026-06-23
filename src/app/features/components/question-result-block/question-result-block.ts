import { Component, signal, inject, computed, input} from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';
import { BarChartBlock } from '../bar-chart-block/bar-chart-block';
import { SupabaseService } from '../../services/supabase-service';
import { Vote } from '../../interfaces/vote';

@Component({
  selector: 'app-question-result-block',
  imports: [BarChartBlock],
  templateUrl: './question-result-block.html',
  styleUrl: './question-result-block.scss',
})
export class QuestionResultBlock {
  surveyDetails = inject(SurveyDetail);
  dbService = inject(SupabaseService);
  questionId = input<number>(0);
  vote = input<Vote>();

  
  readonly questionText = signal('');
  readonly numberOfQuestion = signal(0);
  readonly questionOptions = computed(() => this.dbService.options().filter(option => option.question_id === this.questionId()));
  readonly order_letter = signal<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  /**
   * This function is called when the component is initialized. It retrieves the question text and number of the question from the survey details 
   * service based on the provided question ID. It updates the respective signals with the fetched data.
   */
  ngOnInit() {
    this.questionText.set(this.surveyDetails.questions().find(question => question.id === this.questionId())?.question ?? '');
    this.numberOfQuestion.set(this.surveyDetails.getNumberOfQuestion(this.questionId()));
 
  }   

}
