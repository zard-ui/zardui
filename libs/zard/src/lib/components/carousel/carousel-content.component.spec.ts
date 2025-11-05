import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { ZardCarouselContentComponent } from './carousel-content.component';
import { ZardCarouselComponent } from './carousel.component';

describe('ZardCarouselContentComponent', () => {
  let component: ZardCarouselContentComponent;
  let fixture: ComponentFixture<ZardCarouselContentComponent>;

  beforeEach(async () => {
    // Create comprehensive mock of Embla API

    await TestBed.configureTestingModule({
      imports: [ZardCarouselContentComponent],
      providers: [ZardCarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCarouselContentComponent);
    component = fixture.componentInstance;
  });

  it('should create comonent', () => {
    expect(component).toBeTruthy();
  });
});
