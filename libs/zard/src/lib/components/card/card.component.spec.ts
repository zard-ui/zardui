import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardCardBodyComponent, ZardCardComponent, ZardCardHeaderComponent, ZardCardHeaderDescriptionComponent, ZardCardHeaderTitleComponent } from './card.component';

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'test-host-component',
  template: `
    <zard-card class="custom-class">
      <zard-card-header class="custom-class">
        <zard-card-header-title class="custom-class"> Title </zard-card-header-title>
        <zard-card-header-description class="custom-class"> Description </zard-card-header-description>
      </zard-card-header>
      <zard-card-body class="custom-class"> Body </zard-card-body>
    </zard-card>
  `,
})
class TestHostComponent {}

describe('ZardCardComponents', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, ZardCardComponent, ZardCardBodyComponent, ZardCardHeaderComponent, ZardCardHeaderTitleComponent, ZardCardHeaderDescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create all components', () => {
    const card = fixture.debugElement.query(By.directive(ZardCardComponent));
    const cardBody = fixture.debugElement.query(By.directive(ZardCardBodyComponent));
    const cardHeader = fixture.debugElement.query(By.directive(ZardCardHeaderComponent));
    const cardHeaderTitle = fixture.debugElement.query(By.directive(ZardCardHeaderTitleComponent));
    const cardHeaderDescription = fixture.debugElement.query(By.directive(ZardCardHeaderDescriptionComponent));

    expect(card).toBeTruthy();
    expect(cardBody).toBeTruthy();
    expect(cardHeader).toBeTruthy();
    expect(cardHeaderTitle).toBeTruthy();
    expect(cardHeaderDescription).toBeTruthy();
  });

  it('should have default classes for ZardCardComponent', () => {
    const card = fixture.debugElement.query(By.directive(ZardCardComponent)).nativeElement;
    expect(card.classList).toContain('block');
    expect(card.classList).toContain('rounded-lg');
    expect(card.classList).toContain('border');
    expect(card.classList).toContain('bg-card');
    expect(card.classList).toContain('text-card-foreground');
    expect(card.classList).toContain('shadow-sm');
    expect(card.classList).toContain('w-full');
    expect(card.classList).toContain('p-6');
    expect(card.classList).toContain('custom-class');
  });

  it('should have default classes for ZardCardBodyComponent', () => {
    const cardBody = fixture.debugElement.query(By.directive(ZardCardBodyComponent)).nativeElement;
    expect(cardBody.classList).toContain('block');
    expect(cardBody.classList).toContain('mt-6');
    expect(cardBody.classList).toContain('custom-class');
  });

  it('should have default classes for ZardCardHeaderComponent', () => {
    const cardHeader = fixture.debugElement.query(By.directive(ZardCardHeaderComponent)).nativeElement;
    expect(cardHeader.classList).toContain('flex');
    expect(cardHeader.classList).toContain('flex-col');
    expect(cardHeader.classList).toContain('space-y-1.5');
    expect(cardHeader.classList).toContain('pb-0');
    expect(cardHeader.classList).toContain('gap-1.5');
    expect(cardHeader.classList).toContain('custom-class');
  });

  it('should have default classes for ZardCardHeaderTitleComponent', () => {
    const cardHeaderTitle = fixture.debugElement.query(By.directive(ZardCardHeaderTitleComponent)).nativeElement;
    expect(cardHeaderTitle.classList).toContain('text-2xl');
    expect(cardHeaderTitle.classList).toContain('font-semibold');
    expect(cardHeaderTitle.classList).toContain('leading-none');
    expect(cardHeaderTitle.classList).toContain('tracking-tight');
    expect(cardHeaderTitle.classList).toContain('custom-class');
  });

  it('should have default classes for ZardCardHeaderDescriptionComponent', () => {
    const cardHeaderDescription = fixture.debugElement.query(By.directive(ZardCardHeaderDescriptionComponent)).nativeElement;
    expect(cardHeaderDescription.classList).toContain('text-sm');
    expect(cardHeaderDescription.classList).toContain('text-muted-foreground');
    expect(cardHeaderDescription.classList).toContain('custom-class');
  });
});
