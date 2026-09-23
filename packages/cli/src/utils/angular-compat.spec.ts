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
