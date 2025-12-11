import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardCarouselContentComponent } from './carousel-content.component';
import { ZardCarouselComponent } from './carousel.component';
import { ZardEventManagerPlugin } from '../../core/provider/event-manager-plugins/zard-event-manager-plugin';

describe('ZardCarouselContentComponent', () => {
  let component: ZardCarouselContentComponent;
  let fixture: ComponentFixture<ZardCarouselContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardCarouselContentComponent],
      providers: [
        ZardCarouselComponent,
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCarouselContentComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
