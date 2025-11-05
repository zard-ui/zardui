import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { ZardCarouselItemComponent } from './carousel-item.component';
import { ZardCarouselComponent } from './carousel.component';

describe('ZardCarouselItemComponent', () => {
  let component: ZardCarouselItemComponent;
  let fixture: ComponentFixture<ZardCarouselItemComponent>;

  beforeEach(async () => {
    // Create comprehensive mock of Embla API

    await TestBed.configureTestingModule({
      imports: [ZardCarouselItemComponent],
      providers: [ZardCarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCarouselItemComponent);
    component = fixture.componentInstance;
  });

  it('should create comonent', () => {
    expect(component).toBeTruthy();
  });
});
