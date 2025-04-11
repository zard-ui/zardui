import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardLoaderComponent } from './loader.component';

describe('ZardLoaderComponent', () => {
  let component: ZardLoaderComponent;
  let fixture: ComponentFixture<ZardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
