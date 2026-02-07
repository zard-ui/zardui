import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import {
  ElementRef,
  PLATFORM_ID,
  type Renderer2,
  RendererFactory2,
  type TemplateRef,
  type ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZardDropdownService } from './dropdown.service';

describe('ZardDropdownService', () => {
  let service: ZardDropdownService;
  let mockOverlay: jest.Mocked<Overlay>;
  let mockOverlayRef: jest.Mocked<OverlayRef & { overlayElement: HTMLElement }>;
  let mockOverlayPositionBuilder: jest.Mocked<OverlayPositionBuilder>;
  let mockPositionStrategy: jest.Mocked<unknown>;
  let mockRendererFactory: jest.Mocked<RendererFactory2>;
  let mockRenderer: jest.Mocked<Renderer2>;
  let mockUnlistenFn: jest.Mock;

  beforeEach(() => {
    mockPositionStrategy = {
      apply: jest.fn(),
    } as unknown as jest.Mocked<unknown>;

    mockOverlayRef = {
      attach: jest.fn(),
      detach: jest.fn(),
      dispose: jest.fn(),
      hasAttached: jest.fn().mockReturnValue(true),
      outsidePointerEvents: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({
            unsubscribe: jest.fn(),
          }),
        }),
      }),
      overlayElement: document.createElement('div'),
    } as unknown as jest.Mocked<OverlayRef & { overlayElement: HTMLElement }>;

    mockOverlayPositionBuilder = {
      flexibleConnectedTo: jest.fn().mockReturnValue({
        withPositions: jest.fn().mockReturnValue({
          withPush: jest.fn().mockReturnValue(mockPositionStrategy),
        }),
      }),
    } as unknown as jest.Mocked<OverlayPositionBuilder>;

    mockOverlay = {
      create: jest.fn().mockReturnValue(mockOverlayRef),
      scrollStrategies: {
        reposition: jest.fn().mockReturnValue({}),
      },
    } as unknown as jest.Mocked<Overlay>;

    mockUnlistenFn = jest.fn();
    mockRenderer = {
      listen: jest.fn().mockReturnValue(mockUnlistenFn),
      destroy: jest.fn(),
    } as unknown as jest.Mocked<Renderer2>;

    mockRendererFactory = {
      createRenderer: jest.fn().mockReturnValue(mockRenderer),
    } as unknown as jest.Mocked<RendererFactory2>;

    TestBed.configureTestingModule({
      providers: [
        ZardDropdownService,
        { provide: Overlay, useValue: mockOverlay },
        { provide: OverlayPositionBuilder, useValue: mockOverlayPositionBuilder },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: RendererFactory2, useValue: mockRendererFactory },
      ],
    });

    service = TestBed.inject(ZardDropdownService);
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
    expect(service.isOpen()).toBe(false);
  });

  describe('toggle', () => {
    let triggerElement: ElementRef;
    let templateRef: TemplateRef<unknown>;
    let viewContainerRef: ViewContainerRef;

    beforeEach(() => {
      triggerElement = new ElementRef(document.createElement('button'));
      templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
      viewContainerRef = {
        createEmbeddedView: jest.fn(),
        clear: jest.fn(),
        element: new ElementRef(document.createElement('div')),
        injector: TestBed.inject(PLATFORM_ID),
      } as unknown as ViewContainerRef;
    });

    it('opens the dropdown when closed', () => {
      service.toggle(triggerElement, templateRef, viewContainerRef);

      expect(mockOverlay.create).toHaveBeenCalled();
      expect(service.isOpen()).toBe(true);
    });

    it('closes the dropdown when open', () => {
      service.toggle(triggerElement, templateRef, viewContainerRef);
      service.toggle(triggerElement, templateRef, viewContainerRef);

      expect(mockOverlayRef.detach).toHaveBeenCalled();
      expect(service.isOpen()).toBe(false);
    });
  });

  describe('close', () => {
    let triggerElement: ElementRef;
    let templateRef: TemplateRef<unknown>;
    let viewContainerRef: ViewContainerRef;

    beforeEach(() => {
      triggerElement = new ElementRef(document.createElement('button'));
      templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
      viewContainerRef = {
        createEmbeddedView: jest.fn(),
        clear: jest.fn(),
        element: new ElementRef(document.createElement('div')),
        injector: TestBed.inject(PLATFORM_ID),
      } as unknown as ViewContainerRef;

      service.toggle(triggerElement, templateRef, viewContainerRef);
    });

    it('detaches the overlay if attached', () => {
      mockOverlayRef.hasAttached.mockReturnValue(true);

      service.close();

      expect(mockOverlayRef.detach).toHaveBeenCalled();
    });

    it('does not detach the overlay if not attached', () => {
      mockOverlayRef.hasAttached.mockReturnValue(false);

      service.close();

      expect(mockOverlayRef.detach).not.toHaveBeenCalled();
    });

    it('sets isOpen signal to false', () => {
      service.close();

      expect(service.isOpen()).toBe(false);
    });

    it('disposes of the overlay', () => {
      service.close();

      expect(mockOverlayRef.dispose).toHaveBeenCalled();
    });

    it('calls unlisten after keyboard navigation is set up', async () => {
      const menuElement = document.createElement('div');
      menuElement.setAttribute('role', 'menu');
      mockOverlayRef.overlayElement.appendChild(menuElement);

      await new Promise(resolve => setTimeout(resolve, 100));

      service.close();

      expect(mockUnlistenFn).toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    let triggerElement: ElementRef;
    let templateRef: TemplateRef<unknown>;
    let viewContainerRef: ViewContainerRef;
    let menuElement: HTMLElement;
    let menuItems: HTMLElement[];

    beforeEach(() => {
      triggerElement = new ElementRef(document.createElement('button'));
      templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
      viewContainerRef = {
        createEmbeddedView: jest.fn(),
        clear: jest.fn(),
        element: new ElementRef(document.createElement('div')),
        injector: TestBed.inject(PLATFORM_ID),
      } as unknown as ViewContainerRef;

      menuElement = document.createElement('div');
      menuElement.setAttribute('role', 'menu');

      menuItems = [document.createElement('div'), document.createElement('div'), document.createElement('div')];

      menuItems.forEach(item => {
        item.setAttribute('z-dropdown-menu-item', '');
        menuElement.appendChild(item);
      });

      mockOverlayRef.overlayElement.appendChild(menuElement);
    });

    it('sets up keyboard navigation on open', async () => {
      service.toggle(triggerElement, templateRef, viewContainerRef);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockRenderer.listen).toHaveBeenCalled();
    });

    it('does not set up keyboard navigation when menu element is missing', () => {
      mockOverlayRef.overlayElement = document.createElement('div');

      service.toggle(triggerElement, templateRef, viewContainerRef);

      expect(mockRenderer.listen).not.toHaveBeenCalled();
    });
  });

  describe('focused item management', () => {
    let triggerElement: ElementRef;
    let templateRef: TemplateRef<unknown>;
    let viewContainerRef: ViewContainerRef;

    beforeEach(() => {
      triggerElement = new ElementRef(document.createElement('button'));
      templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
      viewContainerRef = {
        createEmbeddedView: jest.fn(),
        clear: jest.fn(),
        element: new ElementRef(document.createElement('div')),
        injector: TestBed.inject(PLATFORM_ID),
      } as unknown as ViewContainerRef;
    });

    it('focuses first item on open', async () => {
      const menuElement = document.createElement('div');
      menuElement.setAttribute('role', 'menu');

      const firstItem = document.createElement('div');
      firstItem.setAttribute('z-dropdown-menu-item', '');
      menuElement.appendChild(firstItem);

      mockOverlayRef.overlayElement.appendChild(menuElement);

      service.toggle(triggerElement, templateRef, viewContainerRef);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(firstItem.dataset['highlighted']).toBe('');
    });
  });
});

describe('ZardDropdownService - server platform behavior', () => {
  let service: ZardDropdownService;
  let triggerElement: ElementRef;
  let templateRef: TemplateRef<unknown>;
  let viewContainerRef: ViewContainerRef;
  let mockOverlay: jest.Mocked<Overlay>;
  let mockOverlayRef: jest.Mocked<OverlayRef & { overlayElement: HTMLElement }>;
  let mockOverlayPositionBuilder: jest.Mocked<OverlayPositionBuilder>;
  let mockRenderer: jest.Mocked<Renderer2>;

  beforeEach(() => {
    mockOverlayRef = {
      attach: jest.fn(),
      detach: jest.fn(),
      dispose: jest.fn(),
      hasAttached: jest.fn().mockReturnValue(true),
      outsidePointerEvents: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({
            unsubscribe: jest.fn(),
          }),
        }),
      }),
      overlayElement: document.createElement('div'),
    } as unknown as jest.Mocked<OverlayRef & { overlayElement: HTMLElement }>;

    mockOverlayPositionBuilder = {
      flexibleConnectedTo: jest.fn().mockReturnValue({
        withPositions: jest.fn().mockReturnValue({
          withPush: jest.fn().mockReturnValue({}),
        }),
      }),
    } as unknown as jest.Mocked<OverlayPositionBuilder>;

    mockOverlay = {
      create: jest.fn().mockReturnValue(mockOverlayRef),
      scrollStrategies: {
        reposition: jest.fn().mockReturnValue({}),
      },
    } as unknown as jest.Mocked<Overlay>;

    mockRenderer = {
      listen: jest.fn(),
      destroy: jest.fn(),
    } as unknown as jest.Mocked<Renderer2>;

    const mockRendererFactory = {
      createRenderer: jest.fn().mockReturnValue(mockRenderer),
    } as unknown as jest.Mocked<RendererFactory2>;

    TestBed.configureTestingModule({
      providers: [
        ZardDropdownService,
        { provide: Overlay, useValue: mockOverlay },
        { provide: OverlayPositionBuilder, useValue: mockOverlayPositionBuilder },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: RendererFactory2, useValue: mockRendererFactory },
      ],
    });

    service = TestBed.inject(ZardDropdownService);

    triggerElement = new ElementRef(document.createElement('button'));
    templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
    viewContainerRef = {
      createEmbeddedView: jest.fn(),
      clear: jest.fn(),
      element: new ElementRef(document.createElement('div')),
      injector: TestBed.inject(PLATFORM_ID),
    } as unknown as ViewContainerRef;
  });

  it('does not set up keyboard navigation on server platform', () => {
    service.toggle(triggerElement, templateRef, viewContainerRef);

    expect(mockRenderer.listen).not.toHaveBeenCalled();
  });
});
