import { Component, Input, signal, inject, computed} from '@angular/core';
import { SurveyDetail } from '../../survey-detail/survey-detail';
import { BarChartBlock } from '../bar-chart-block/bar-chart-block';
import { SupabaseService } from '../../services/supabase-service';

type Result = {
    id: number;
    question_id: number;
    option_id: number;
}
type Option = {
    id: number;
    question_id: number;
    option_text: string;
    option_selected: boolean;
}

@Component({
  selector: 'app-question-result-block',
  imports: [BarChartBlock],
  templateUrl: './question-result-block.html',
  styleUrl: './question-result-block.scss',
})
export class QuestionResultBlock {
  @Input() questionId = 0;
  surveyDetails = inject(SurveyDetail);
  dbService = inject(SupabaseService);
  @Input() result!: Result;
  readonly questionText = signal('');
  readonly numberOfQuestion = signal(0);
  readonly questionOptions = computed(() => this.dbService.options().filter(option => option.question_id === this.questionId));
  readonly order_letter = signal<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);

  ngOnInit() {
    this.questionText.set(this.surveyDetails.questions().find(question => question.id === this.questionId)?.question ?? '');
    this.numberOfQuestion.set(this.surveyDetails.getNumberOfQuestion(this.questionId));
  }   
}
