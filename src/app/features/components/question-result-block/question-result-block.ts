import { Component, signal, inject, computed, input} from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';
import { BarChartBlock } from '../bar-chart-block/bar-chart-block';
import { SupabaseService } from '../../services/supabase-service';
import { Vote } from '../../interfaces/vote';
import { Question } from '../../interfaces/question';

@Component({
  selector: 'app-question-result-block',
  imports: [BarChartBlock],
  templateUrl: './question-result-block.html',
  styleUrl: './question-result-block.scss',
})
export class QuestionResultBlock {
  surveyDetails = inject(SurveyDetail);
  dbService = inject(SupabaseService);
  vote = input<Vote>();
  readonly questionOfResult = input.required<Question>();

  
  readonly questionText = computed(() => this.questionOfResult().question);
  readonly numberOfQuestion = computed(() => this.surveyDetails.getNumberOfQuestion(this.questionOfResult().id));
  readonly questionOptions = computed(() => this.dbService.options().filter(option => option.question_id === this.questionOfResult().id));
  readonly order_letter = signal<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

}
