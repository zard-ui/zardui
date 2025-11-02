/**
 * Custom Commitlint Plugin
 *
 * Provides better error messages for emoji-based commits
 */

const EMOJI_LIST = [
  '✨',
  '🐛',
  '📦',
  '🔧',
  '🚧',
  '🧪',
  '✏️',
  '📝',
  '🚀',
  '💄',
  '🏗️',
  '⏪️',
  '🌐',
  '🎉',
  '📈',
  '🗃️',
  '🔖',
];

const EMOJI_TO_TYPE = {
  '✨': 'feat',
  '🐛': 'fix',
  '📦': 'refactor',
  '🔧': 'ci',
  '🚧': 'chore',
  '🧪': 'test',
  '✏️': 'docs',
  '📝': 'docs',
  '🚀': 'perf',
  '💄': 'style',
  '🏗️': 'build',
  '⏪️': 'revert',
  '🌐': 'i18n',
  '🎉': 'initial',
  '📈': 'analytics',
  '🗃️': 'database',
  '🔖': 'release',
};

module.exports = {
  rules: {
    'emoji-required': parsed => {
      const { header } = parsed;

      // Check if message starts with an emoji
      const startsWithEmoji = EMOJI_LIST.some(emoji => header.startsWith(emoji));

      if (!startsWithEmoji) {
        const firstWord = header.split(/[\s(:]/)[0];
        const suggestedEmoji = Object.entries(EMOJI_TO_TYPE).find(([, type]) => type === firstWord);

        let message = '❌ Commit MUST start with an emoji!\n\n';
        message += '📋 Format: emoji type(scope): description\n';
        message += '   Example: ✨ feat(button): add new variant\n\n';

        if (suggestedEmoji) {
          message += `💡 Did you mean: ${suggestedEmoji[0]} ${header}\n\n`;
        }

        message += '📝 Available emojis:\n';
        message += '   ✨ feat      - New feature\n';
        message += '   🐛 fix       - Bug fix\n';
        message += '   📦 refactor  - Code refactoring\n';
        message += '   🧪 test      - Tests\n';
        message += '   📝 docs      - Documentation\n';
        message += '   🚀 perf      - Performance\n';
        message += '   🔧 ci        - CI/CD changes\n';
        message += '   🚧 chore     - Maintenance\n';
        message += '   💄 style     - Code style\n';
        message += '   🏗️ build     - Build system\n';
        message += '\n💡 Tip: Use your VSCode Commit Message Editor extension';

        return [false, message];
      }

      return [true, ''];
    },
  },
};
