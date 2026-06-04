import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartBlock } from './bar-chart-block';

describe('BarChartBlock', () => {
  let component: BarChartBlock;
  let fixture: ComponentFixture<BarChartBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
