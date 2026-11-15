import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@zard/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@zard/components/code-block/code-block.variants';

import { ExampleImports } from './example.component';

const COMMAND = 'pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide';

const BUILD_OUTPUT = `$ ng build
Initial chunk files   | Names         |  Raw size | Estimated transfer size
main-HJ2K4QXZ.js      | main          | 208.31 kB |                56.24 kB
styles-5INURTSO.css   | styles        |  14.07 kB |                 3.18 kB

                      | Initial total | 222.38 kB |                59.42 kB

Application bundle generation complete. [4.218 seconds]`;

const INSTALL_OUTPUT = `$ ${COMMAND}
Packages: +9
Progress: resolved 412, reused 403, downloaded 9, added 9, done
Done in 2.8s using pnpm v10.18.0`;

const ERROR_OUTPUT = `ERROR TypeError: Cannot read properties of undefined (reading 'map')
    at MessageListComponent_Template (message-list.component.html:4:22)
    at executeTemplate (core.mjs:12162:9)`;

const PACKAGE_JSON = `{
  "name": "chat",
  "private": true,
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  }
}`;

const PATCH = ` @Component({
   selector: 'app-greeting',
-  template: '<p>Hello, {{ name() }}</p>',
+  template: '<p>Hello, {{ name() }}!</p>',
 })`;

function lineType(line: string): ZardCodeBlockLineTypeVariants {
  if (line.startsWith('+')) {
    return 'added';
  }

  if (line.startsWith('-')) {
    return 'removed';
  }

  return 'default';
}

/** The code block's demos, laid out as an `/create` example page. */
@Component({
  selector: 'z-code-block-example',
  imports: [ExampleImports, NgIcon, ZardCodeBlockImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-code-block>
          <z-code-block-content>{{ buildOutput }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Header">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>
              <ng-icon name="lucideTerminal" />
              Terminal
            </z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="command" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content>{{ installOutput }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Size">
        <z-code-block zSize="sm">
          <z-code-block-header>
            <z-code-block-title>
              <ng-icon name="lucideTerminal" />
              Terminal
            </z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="command" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content zWrap>{{ installOutput }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Floating Actions">
        <z-code-block>
          <z-code-block-actions>
            <z-code-block-copy-button [zValue]="command" />
          </z-code-block-actions>
          <z-code-block-content>{{ installOutput }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Line Numbers">
        <z-code-block>
          <z-code-block-content zLineNumbers>{{ packageJson }}</z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Diff">
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>src/app/greeting/greeting.component.ts</z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="patch" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content>
            @for (line of lines; track $index) {
              <z-code-block-line [zType]="line.type">{{ line.text }}</z-code-block-line>
            }
          </z-code-block-content>
        </z-code-block>
      </z-example>

      <z-example zTitle="Destructive">
        <z-code-block zType="destructive">
          <z-code-block-header>
            <z-code-block-title>Error</z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="errorOutput" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content zWrap>{{ errorOutput }}</z-code-block-content>
        </z-code-block>
      </z-example>
    </z-example-wrapper>
  `,
})
export class CodeBlockExampleComponent {
  protected readonly command = COMMAND;
  protected readonly buildOutput = BUILD_OUTPUT;
  protected readonly installOutput = INSTALL_OUTPUT;
  protected readonly errorOutput = ERROR_OUTPUT;
  protected readonly packageJson = PACKAGE_JSON;
  protected readonly patch = PATCH;

  // The first character of a diff row is the marker (+, - or a space); the line component draws it instead.
  protected readonly lines = PATCH.split('\n').map(line => ({ type: lineType(line), text: line.slice(1) }));
}
