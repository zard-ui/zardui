import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPage } from './doc.page';

describe('DocPage', () => {
  let component: DocPage;
  let fixture: ComponentFixture<DocPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
