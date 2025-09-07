import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

// Polyfill/fix MutationObserver for happy-dom environment
// Angular CDK Overlay requires a fully functional MutationObserver
class MutationObserverPolyfill implements MutationObserver {
  private callback: MutationCallback;
  private observedNodes = new Set<Node>();

  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  observe(target: Node, options?: MutationObserverInit): void {
    this.observedNodes.add(target);
    // For testing purposes, just store the target and resolve immediately
    // This prevents the "observe is not a function" error
  }

  disconnect(): void {
    this.observedNodes.clear();
  }

  takeRecords(): MutationRecord[] {
    return [];
  }
}

// Replace the global MutationObserver with our polyfill
// This ensures compatibility with Angular CDK Overlay
global.MutationObserver = MutationObserverPolyfill as any;
