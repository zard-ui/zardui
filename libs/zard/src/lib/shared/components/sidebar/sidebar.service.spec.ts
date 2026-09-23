import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import { ZARD_SIDEBAR_COOKIE_MAX_AGE, ZARD_SIDEBAR_COOKIE_NAME } from './sidebar.constants';
import { ZardSidebarService } from './sidebar.service';

const createDocumentMock = (initialCookie = '') => {
  const state = { cookie: initialCookie };

  return {
    get cookie() {
      return state.cookie;
    },
    set cookie(value: string) {
      state.cookie = value;
    },
  };
};

const setup = (options: { cookie?: string; matches?: boolean } = {}) => {
  const documentMock = createDocumentMock(options.cookie ?? '');
  const matches = new BehaviorSubject({ matches: options.matches ?? false, breakpoints: {} });

  TestBed.configureTestingModule({
    providers: [
      ZardSidebarService,
      { provide: DOCUMENT, useValue: documentMock },
      { provide: BreakpointObserver, useValue: { observe: () => matches.asObservable() } },
    ],
  });

  return { service: TestBed.inject(ZardSidebarService), documentMock, matches };
};

describe('ZardSidebarService', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('defaults to open with state expanded', () => {
    const { service } = setup();

    expect(service.open()).toBe(true);
    expect(service.state()).toBe('expanded');
  });

  it('writes the cookie on setOpen', () => {
    const { service, documentMock } = setup();

    service.setOpen(false);

    expect(documentMock.cookie).toBe(
      `${ZARD_SIDEBAR_COOKIE_NAME}=false; path=/; max-age=${ZARD_SIDEBAR_COOKIE_MAX_AGE}`,
    );
  });

  it('takes the initial state from the cookie when present', () => {
    const { service } = setup({ cookie: `foo=bar; ${ZARD_SIDEBAR_COOKIE_NAME}=false; other=1` });

    expect(service.open()).toBe(false);
    expect(service.state()).toBe('collapsed');
  });

  it('lets an explicit zDefaultOpen win over the cookie', () => {
    const { service } = setup({ cookie: `${ZARD_SIDEBAR_COOKIE_NAME}=false` });

    service.applyDefaultOpen(true);

    expect(service.open()).toBe(true);
  });

  it('keeps the cookie when zDefaultOpen is left unset', () => {
    const { service } = setup({ cookie: `${ZARD_SIDEBAR_COOKIE_NAME}=false` });

    service.applyDefaultOpen(undefined);

    expect(service.open()).toBe(false);
  });

  it('falls back to open when there is neither a cookie nor a zDefaultOpen', () => {
    const { service } = setup();

    service.applyDefaultOpen(undefined);

    expect(service.open()).toBe(true);
  });

  it('applies zDefaultOpen when there is no cookie', () => {
    const { service } = setup();

    service.applyDefaultOpen(false);

    expect(service.open()).toBe(false);
  });

  it('accepts an updater function in setOpen', () => {
    const { service } = setup();

    service.setOpen(open => !open);

    expect(service.open()).toBe(false);
  });

  it('reports through onOpenChange without mutating internal state while controlled', () => {
    const { service } = setup();
    const reported: boolean[] = [];

    service.onOpenChange = open => reported.push(open);
    service.controlledOpen.set(true);

    service.setOpen(false);

    expect(reported).toEqual([false]);
    expect(service.open()).toBe(true);
  });

  it('reacts to the breakpoint observer', () => {
    const { service, matches } = setup({ matches: true });

    expect(service.isMobile()).toBe(true);

    matches.next({ matches: false, breakpoints: {} });

    expect(service.isMobile()).toBe(false);
  });

  it('toggles openMobile instead of open while mobile', () => {
    const { service } = setup({ matches: true });

    service.toggleSidebar();

    expect(service.openMobile()).toBe(true);
    expect(service.open()).toBe(true);

    service.toggleSidebar();

    expect(service.openMobile()).toBe(false);
  });

  it('toggles open on desktop', () => {
    const { service } = setup();

    service.toggleSidebar();

    expect(service.open()).toBe(false);
    expect(service.openMobile()).toBe(false);
  });
});
