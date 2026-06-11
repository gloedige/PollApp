import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly publishNewSurvey = input<boolean>(true);
  readonly cancelNewSurvey = input<boolean>(false);
  readonly buttonType = input<'primary' | 'secondary' | 'tertiary' | 'filter'>('primary');
  readonly text = input<string>('Button');
  @Input() hideIcon: boolean = false;
}
