import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardCarouselItemComponent } from './carousel-item.component';
import { ZardCarouselComponent } from './carousel.component';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

describe('ZardCarouselItemComponent', () => {
  let component: ZardCarouselItemComponent;
  let fixture: ComponentFixture<ZardCarouselItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCarouselItemComponent],
      providers: [
        ZardCarouselComponent,
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCarouselItemComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
