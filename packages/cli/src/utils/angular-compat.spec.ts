import { angularMajorOf, pinAllForAngular, pinForAngular } from '@cli/utils/angular-compat.js';

describe('angularMajorOf', () => {
  it('reads the major from a version string', () => {
    expect(angularMajorOf('21.2.21')).toBe(21);
    expect(angularMajorOf('19.0.0-rc.2')).toBe(19);
  });

  it('returns null when there is no version to read', () => {
    expect(angularMajorOf(null)).toBeNull();
    expect(angularMajorOf(undefined)).toBeNull();
    expect(angularMajorOf('not-a-version')).toBeNull();
  });
});

describe('pinForAngular', () => {
  it('pins the packages whose major is the Angular major', () => {
    expect(pinForAngular('@angular/cdk', 21)).toBe('@angular/cdk@^21');
    expect(pinForAngular('ngx-echarts', 21)).toBe('ngx-echarts@^21');
    expect(pinForAngular('embla-carousel-angular', 19)).toBe('embla-carousel-angular@^19');
  });

  it('pins the packages that version on their own schedule from the table', () => {
    expect(pinForAngular('@ng-icons/core', 21)).toBe('@ng-icons/core@^34');
    expect(pinForAngular('@ng-icons/core', 20)).toBe('@ng-icons/core@^32');
    expect(pinForAngular('@ng-icons/lucide', 19)).toBe('@ng-icons/lucide@^31');
  });

  /**
   * The newest Angular is deliberately absent from the table — `latest` is the
   * release built for it, and hardcoding a ceiling would freeze it out of the
   * next one.
   */
  it('leaves a package unconstrained on an Angular major it has no entry for', () => {
    expect(pinForAngular('@ng-icons/core', 22)).toBe('@ng-icons/core');
    expect(pinForAngular('@ng-icons/core', 99)).toBe('@ng-icons/core');
  });

  it('leaves packages that span several Angular majors alone', () => {
    expect(pinForAngular('ngx-sonner', 21)).toBe('ngx-sonner');
    expect(pinForAngular('clsx', 21)).toBe('clsx');
    expect(pinForAngular('tailwind-merge', 19)).toBe('tailwind-merge');
  });

  it('constrains nothing when the Angular version could not be read', () => {
    expect(pinForAngular('@angular/cdk', null)).toBe('@angular/cdk');
    expect(pinForAngular('@ng-icons/core', null)).toBe('@ng-icons/core');
  });
});

describe('pinForAngular with versioned registry dependencies', () => {
  it('finds the package by name when the registry item already carries a version', () => {
    // Before the version was split off, the lookup was for the string "ng-mapcn@22.0.0-beta.7" and matched nothing.
    expect(pinForAngular('ng-mapcn@22.0.0-beta.7', 21)).toBe('ng-mapcn@21.0.0-beta.7');
    expect(pinForAngular('ng-mapcn@22.0.0-beta.7', 19)).toBe('ng-mapcn@18.0.0-beta.4');
    expect(pinForAngular('maplibre-gl@^6.11.2', 21)).toBe('maplibre-gl@^5.16.0');
  });

  it("keeps the item's own version on the Angular major it was written for", () => {
    expect(pinForAngular('ng-mapcn@22.0.0-beta.7', 22)).toBe('ng-mapcn@22.0.0-beta.7');
    expect(pinForAngular('maplibre-gl@^6.11.2', 22)).toBe('maplibre-gl@^6.11.2');
  });

  it('does not rewrite a tracked package that names its own version', () => {
    expect(pinForAngular('@angular/cdk@^20.1.0', 21)).toBe('@angular/cdk@^20.1.0');
  });

  it('does not mistake the scope marker for a version', () => {
    expect(pinForAngular('@angular/cdk', 21)).toBe('@angular/cdk@^21');
  });

  it('pins a batch that mixes bare and versioned names', () => {
    expect(pinAllForAngular(['ng-mapcn@22.0.0-beta.7', 'maplibre-gl@^6.11.2', 'clsx'], '21.2.0')).toEqual([
      'ng-mapcn@21.0.0-beta.7',
      'maplibre-gl@^5.16.0',
      'clsx',
    ]);
  });
});

describe('pinAllForAngular', () => {
  it('keeps the order it was given', () => {
    expect(pinAllForAngular(['clsx', '@angular/cdk', '@ng-icons/core'], '21.2.0')).toEqual([
      'clsx',
      '@angular/cdk@^21',
      '@ng-icons/core@^34',
    ]);
  });

  it('accepts a Set, which is how the resolver collects dependencies', () => {
    expect(pinAllForAngular(new Set(['ngx-echarts', 'echarts']), '21.0.0')).toEqual(['ngx-echarts@^21', 'echarts']);
  });
});
