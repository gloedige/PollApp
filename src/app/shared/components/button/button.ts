import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
  readonly hideIcon = input<boolean>(false);
  readonly isActive = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
}
