import { TestBed } from '@angular/core/testing';

import { ZardDarkMode, EDarkModes } from './dark-mode';

describe('ZardDarkMode - System Appearance Change Detection', () => {
  let darkModeService: ZardDarkMode;
  let mockMatchMedia: jest.Mock;
  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  beforeEach(() => {
    // Mock matchMedia and localStorage
    mockMediaQueryList = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    mockMatchMedia = jest.fn().mockReturnValue(mockMediaQueryList);

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};

      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    TestBed.configureTestingModule({
      providers: [ZardDarkMode],
    });

    darkModeService = TestBed.inject(ZardDarkMode);
    darkModeService.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clear localStorage mock to prevent state leakage between tests
    window.localStorage.clear();
  });

  it('initializes dark mode query on service creation', () => {
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(darkModeService.themeMode()).toBe(EDarkModes.LIGHT);
  });

  it('starts listening for system changes when theme set to SYSTEM', () => {
    darkModeService.toggleTheme(EDarkModes.SYSTEM);
    TestBed.tick();

    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('stops listening for system changes when theme changed from SYSTEM', () => {
    darkModeService.toggleTheme(EDarkModes.SYSTEM);
    mockMediaQueryList.addEventListener.mockClear();

    darkModeService.toggleTheme(EDarkModes.LIGHT);
    TestBed.tick();

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(mockMediaQueryList.addEventListener).not.toHaveBeenCalled();
  });

  it('updates theme when system preference changes to dark mode', () => {
    darkModeService.toggleTheme(EDarkModes.SYSTEM);
    TestBed.tick();

    const callback = mockMediaQueryList.addEventListener.mock.calls.find(call => call[0] === 'change')?.[1];

    expect(callback).toBeDefined();

    mockMediaQueryList.matches = true;
    callback({ matches: true });

    expect(darkModeService.themeMode()).toBe(EDarkModes.DARK);
  });

  it('initializes with system dark theme when no stored theme exists', () => {
    TestBed.resetTestingModule();
    mockMediaQueryList.matches = true;

    mockMediaQueryList.addEventListener.mockClear();

    TestBed.configureTestingModule({
      providers: [ZardDarkMode],
    });

    const newService = TestBed.inject(ZardDarkMode);
    newService.init();

    expect(newService.themeMode()).toBe(EDarkModes.DARK);
  });

  it('listens for system appearance changes from init when default is SYSTEM', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ZardDarkMode],
    });

    mockMediaQueryList.matches = false;
    mockMediaQueryList.addEventListener.mockClear();

    const newService = TestBed.inject(ZardDarkMode);
    newService.init();
    TestBed.tick();

    expect(newService.themeMode()).toBe(EDarkModes.LIGHT);
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalled();
  });

  describe('toggleTheme', () => {
    it('toggles between light and dark modes', () => {
      darkModeService.toggleTheme(EDarkModes.LIGHT);
      expect(darkModeService.themeMode()).toBe(EDarkModes.LIGHT);

      darkModeService.toggleTheme();
      expect(darkModeService.themeMode()).toBe(EDarkModes.DARK);

      darkModeService.toggleTheme();
      expect(darkModeService.themeMode()).toBe(EDarkModes.LIGHT);
    });

    it('toggles from system dark to light mode', () => {
      mockMediaQueryList.matches = true;

      darkModeService.toggleTheme(EDarkModes.SYSTEM);
      TestBed.tick();
      expect(darkModeService.themeMode()).toBe(EDarkModes.DARK);

      darkModeService.toggleTheme();
      TestBed.tick();
      expect(darkModeService.themeMode()).toBe(EDarkModes.LIGHT);
      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalled();
    });

    it('toggles from system light to dark mode', () => {
      mockMediaQueryList.matches = false;

      darkModeService.toggleTheme(EDarkModes.SYSTEM);
      TestBed.tick();
      expect(darkModeService.themeMode()).toBe(EDarkModes.LIGHT);

      darkModeService.toggleTheme();
      TestBed.tick();
      expect(darkModeService.themeMode()).toBe(EDarkModes.DARK);
      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalled();
    });

    it('sets specific theme mode when targetMode provided', () => {
      darkModeService.toggleTheme(EDarkModes.LIGHT);
      expect(darkModeService.themeMode()).toBe(EDarkModes.LIGHT);

      darkModeService.toggleTheme(EDarkModes.DARK);
      expect(darkModeService.themeMode()).toBe(EDarkModes.DARK);

      mockMediaQueryList.matches = true;

      darkModeService.toggleTheme(EDarkModes.SYSTEM);
      TestBed.tick();
      expect(darkModeService.themeMode()).toBe(EDarkModes.DARK);
      expect(mockMediaQueryList.addEventListener).toHaveBeenCalled();
    });
  });
});
