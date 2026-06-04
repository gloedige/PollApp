import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly primary = input<boolean>(true);
  readonly text = input<string>('Button');
  @Input() hideIcon: boolean = false;
}
