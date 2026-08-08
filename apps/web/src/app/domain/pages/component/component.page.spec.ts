import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ComponentPage } from './component.page';

describe('ComponentPage', () => {
  let component: ComponentPage;
  let fixture: ComponentFixture<ComponentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
