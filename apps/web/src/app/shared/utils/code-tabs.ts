// Code tabs functionality for enhanced markdown code blocks

declare global {
  interface Window {
    switchCodeTab: (event: Event, tabIndex: number) => void;
    copyCodeToClipboard: (button: HTMLButtonElement, code: string) => void;
    toggleExpandableCode: (button: HTMLButtonElement) => void;
    copyTabCode: (button: HTMLButtonElement) => void;
  }
}

// Function to switch between code tabs
window.switchCodeTab = function (event: Event, tabIndex: number) {
  event.preventDefault();

  const button = event.target as HTMLButtonElement;
  const tabsWrapper = button.closest('.code-tabs-wrapper');

  if (!tabsWrapper) return;

  // Update tab buttons
  const allButtons = tabsWrapper.querySelectorAll('button[data-tab]');
  const allContents = tabsWrapper.querySelectorAll('.code-tab-content');

  allButtons.forEach((btn, index) => {
    if (index === tabIndex) {
      btn.classList.add('bg-code-tab', 'text-foreground', 'border');
      btn.classList.remove('text-muted-foreground');
    } else {
      btn.classList.remove('bg-code-tab', 'text-foreground', 'border');
      btn.classList.add('text-muted-foreground');
    }
  });

  // Update tab contents
  allContents.forEach((content, index) => {
    if (index === tabIndex) {
      content.classList.remove('hidden');
      content.classList.add('block');
    } else {
      content.classList.add('hidden');
      content.classList.remove('block');
    }
  });
};

// Function to toggle expandable code visibility
window.toggleExpandableCode = function (button: HTMLButtonElement) {
  const overlay = button.closest('.expandable-overlay') as HTMLElement;
  const wrapper = overlay?.closest('.group') as HTMLElement;

  if (!overlay) return;

  // Remove height constraint to allow full expansion
  if (wrapper) {
    wrapper.classList.remove('h-[250px]');
    wrapper.classList.add('h-auto');
  }

  // Simply remove the overlay - no animations
  overlay.remove();
};

// Copy code function with visual feedback
function copyCodeToClipboard(button: HTMLButtonElement, code: string): void {
  // Copy to clipboard
  navigator.clipboard
    .writeText(code)
    .then(() => {
      // Save original content
      const originalHTML = button.innerHTML;

      // Show success feedback with check icon
      button.innerHTML = `<img src="/icons/check.svg" alt="Copied" class="h-4 w-4 text-green-500" />`;

      // Add success animation
      button.classList.add('bg-green-50', 'border-green-200', 'text-green-600');
      button.classList.remove('text-muted-foreground');

      // Reset after 2 seconds
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('bg-green-500', 'border-green-200', 'text-green-600');
        button.classList.add('text-muted-foreground');
      }, 2000);
    })
    .catch(() => {
      // Show error feedback
      button.classList.add('bg-red-50', 'border-red-200', 'text-red-600');
      button.classList.remove('text-muted-foreground');

      setTimeout(() => {
        button.classList.remove('bg-red-50', 'border-red-200', 'text-red-600');
        button.classList.add('text-muted-foreground');
      }, 2000);
    });
}

// Function to copy code from active tab
window.copyTabCode = function (button: HTMLButtonElement) {
  const tabsWrapper = button.closest('.code-tabs-wrapper');
  if (!tabsWrapper) return;

  // Find the active tab button (the one that's currently selected)
  const activeTabButton = tabsWrapper.querySelector('button[data-tab].bg-background') || tabsWrapper.querySelector('button[data-tab].text-foreground');

  if (!activeTabButton) return;

  // Get the code from the active tab's data-code attribute
  const code = activeTabButton.getAttribute('data-code') || '';

  if (!code) return;

  // Use the same copy logic with visual feedback
  copyCodeToClipboard(button, code);
};

// Make functions globally available
window.copyCodeToClipboard = copyCodeToClipboard;

// Initialize code tabs when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Add any additional initialization here if needed
  });
}

export {}; // Make this file a module
