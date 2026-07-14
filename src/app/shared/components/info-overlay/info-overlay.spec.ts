import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoOverlay } from './info-overlay';

describe('InfoOverlay', () => {
  let component: InfoOverlay;
  let fixture: ComponentFixture<InfoOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
