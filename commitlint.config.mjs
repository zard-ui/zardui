/**
 * Commitlint Configuration
 *
 * Validates commit messages to ensure they follow the project's emoji + conventional commit format.
 * Emoji is REQUIRED at the start of every commit.
 */

import customPlugin from './commitlint-plugin.cjs';

export default {
  // Don't extend gitmoji - use custom emoji validation
  extends: [],

  // Load custom plugin for better error messages
  plugins: [
    {
      rules: customPlugin.rules,
    },
  ],

  parserPreset: {
    parserOpts: {
      // Custom header pattern - EMOJI IS REQUIRED, scope is optional, subject is required:
      // ✨ feat(scope): description  ✓
      // ✨ feat: description         ✓
      // The emoji must be at the start
      headerPattern: /^(✨|🐛|📦|🔧|🚧|🧪|✏️|📝|🚀|💄|🏗️|⏪️|🌐|🎉|📈|🗃️|🔖)\s+(\w+)(?:\(([^)]+)\))?(!)?: (.+)$/,
      headerCorrespondence: ['emoji', 'type', 'scope', 'breaking', 'subject'],
    },
  },

  rules: {
    // Custom rule: Emoji is required
    'emoji-required': [2, 'always'],

    // Override default rules to be more permissive with emoji
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert', 'i18n', 'analytics', 'database', 'initial', 'release'],
    ],

    // Subject should not be empty (description is required)
    'subject-empty': [2, 'never'],

    // Subject should not end with period
    'subject-full-stop': [2, 'never', '.'],

    // Subject should be lowercase (disabled because of proper nouns)
    'subject-case': [0],

    // Header max length
    'header-max-length': [2, 'always', 100],

    // Body max line length
    'body-max-line-length': [2, 'always', 100],

    // Scope is optional - disabled validation
    'scope-empty': [0],
    'scope-case': [0],

    // Type should be lowercase
    'type-case': [2, 'always', 'lower-case'],
  },

  // Custom prompt configurations for commitizen
  prompt: {
    questions: {
      type: {
        description: "Select the type of change you're committing",
        enum: {
          feat: {
            description: '✨ A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: '🐛 A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '📝 Documentation only changes',
            title: 'Documentation',
            emoji: '📝',
          },
          style: {
            description: '💄 Changes that do not affect the meaning of the code',
            title: 'Styles',
            emoji: '💄',
          },
          refactor: {
            description: '📦 A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '🚀 A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '🧪 Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🧪',
          },
          build: {
            description: '🏗️ Changes that affect the build system or external dependencies',
            title: 'Builds',
            emoji: '🏗️',
          },
          ci: {
            description: '🔧 Changes to our CI configuration files and scripts',
            title: 'Continuous Integrations',
            emoji: '🔧',
          },
          chore: {
            description: "🔧 Other changes that don't modify src or test files",
            title: 'Chores',
            emoji: '🔧',
          },
          revert: {
            description: '⏪️ Reverts a previous commit',
            title: 'Reverts',
            emoji: '⏪️',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change (optional)',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description: 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #456")',
      },
    },
  },
};
