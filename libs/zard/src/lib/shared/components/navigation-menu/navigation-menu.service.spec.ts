import type { TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZardNavigationMenuService } from './navigation-menu.service';

describe('ZardNavigationMenuService', () => {
  let service: ZardNavigationMenuService;

  const templateFor = (name: string) => ({ name }) as unknown as TemplateRef<void>;
  const elementFor = () => document.createElement('button');

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ZardNavigationMenuService] });
    service = TestBed.inject(ZardNavigationMenuService);
  });

  it('should hand out sequential indexes', () => {
    expect(service.registerTrigger()).toBe(0);
    expect(service.registerTrigger()).toBe(1);
    expect(service.registerTrigger()).toBe(2);
  });

  it('should start closed', () => {
    expect(service.isOpen()).toBe(false);
    expect(service.activeTemplate()).toBeNull();
    expect(service.motion()).toBeNull();
  });

  it('should expose the active template', () => {
    const template = templateFor('first');
    service.open({ index: 0, template, element: elementFor() });

    expect(service.isOpen()).toBe(true);
    expect(service.isActive(0)).toBe(true);
    expect(service.activeTemplate()).toBe(template);
  });

  it('should not replay the slide when the active trigger re-opens', () => {
    service.open({ index: 0, template: templateFor('first'), element: elementFor() });
    service.open({ index: 1, template: templateFor('second'), element: elementFor() });
    service.open({ index: 1, template: templateFor('second'), element: elementFor() });

    expect(service.motion()).toBe('from-end');
  });

  it('should refresh the template of the trigger already active', () => {
    const updated = templateFor('updated');

    service.open({ index: 0, template: templateFor('first'), element: elementFor() });
    service.open({ index: 0, template: updated, element: elementFor() });

    expect(service.activeTemplate()).toBe(updated);
    expect(service.motion()).toBeNull();
  });

  it('should only honour close() for the trigger that owns the viewport', () => {
    service.open({ index: 0, template: templateFor('first'), element: elementFor() });

    service.close(1);
    expect(service.isOpen()).toBe(true);

    service.close(0);
    expect(service.isOpen()).toBe(false);
  });

  it('should not slide directionally on the opening that follows a close', () => {
    service.open({ index: 0, template: templateFor('first'), element: elementFor() });
    service.open({ index: 1, template: templateFor('second'), element: elementFor() });
    expect(service.motion()).toBe('from-end');

    service.close();
    service.open({ index: 1, template: templateFor('second'), element: elementFor() });

    expect(service.motion()).toBeNull();
  });

  it('should close after the hover delay', done => {
    service.hoverDelay.set(20);
    service.open({ index: 0, template: templateFor('first'), element: elementFor() });

    service.scheduleClose(0);
    expect(service.isOpen()).toBe(true);

    setTimeout(() => {
      expect(service.isOpen()).toBe(false);
      done();
    }, 40);
  });

  it('should let a new opening cancel a scheduled close', done => {
    service.hoverDelay.set(20);
    service.open({ index: 0, template: templateFor('first'), element: elementFor() });

    service.scheduleClose(0);
    service.open({ index: 1, template: templateFor('second'), element: elementFor() });

    setTimeout(() => {
      expect(service.isOpen()).toBe(true);
      expect(service.isActive(1)).toBe(true);
      done();
    }, 40);
  });

  it('should let cancelScheduledClose stop the timer', done => {
    service.hoverDelay.set(20);
    service.open({ index: 0, template: templateFor('first'), element: elementFor() });

    service.scheduleClose(0);
    service.cancelScheduledClose();

    setTimeout(() => {
      expect(service.isOpen()).toBe(true);
      done();
    }, 40);
  });
});
