import { Component, inject, Renderer2 } from '@angular/core';
import { Button } from "../../shared/components/button/button";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-survey-detail',
  imports: [Button],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'detail-page');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'detail-page');
  }
}
