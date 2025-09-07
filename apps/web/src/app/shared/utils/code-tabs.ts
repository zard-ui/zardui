// Code tabs functionality for enhanced markdown code blocks

declare global {
  interface Window {
    switchCodeTab: (event: Event, tabIndex: number) => void;
    copyCodeToClipboard: (button: HTMLButtonElement, code: string) => void;
    toggleExpandableCode: (button: HTMLButtonElement) => void;
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
      btn.classList.add('bg-background', 'text-foreground');
      btn.classList.remove('text-muted-foreground');
    } else {
      btn.classList.remove('bg-background', 'text-foreground');
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
  const wrapper = overlay?.closest('.expandable-wrapper') as HTMLElement;
  
  if (!overlay || !wrapper) return;
  
  // Add fade out animation to overlay
  overlay.style.opacity = '0';
  overlay.style.transform = 'scale(0.95)';
  
  // Remove overlay after animation completes
  setTimeout(() => {
    overlay.remove();
    
    // Add a subtle entrance animation to the revealed content
    wrapper.style.transform = 'scale(0.98)';
    wrapper.style.opacity = '0.7';
    
    // Animate to full visibility
    requestAnimationFrame(() => {
      wrapper.style.transition = 'all 0.3s ease-out';
      wrapper.style.transform = 'scale(1)';
      wrapper.style.opacity = '1';
      
      // Clean up transition after animation
      setTimeout(() => {
        wrapper.style.transition = '';
        wrapper.style.transform = '';
        wrapper.style.opacity = '';
      }, 300);
    });
  }, 300);
};

// Copy code function with visual feedback
function copyCodeToClipboard(button: HTMLButtonElement, code: string): void {
  // Copy to clipboard
  navigator.clipboard
    .writeText(code)
    .then(() => {
      // Save original content
      const originalHTML = button.innerHTML;

      // Show success feedback with Lucide check icon
      button.innerHTML = `<i class="icon-check text-green-500"></i>`;

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

// Make functions globally available
window.copyCodeToClipboard = copyCodeToClipboard;

// Initialize code tabs when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Add any additional initialization here if needed
  });
}

export {}; // Make this file a module
