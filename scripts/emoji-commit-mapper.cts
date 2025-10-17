/**
 * Emoji to Conventional Commit Mapper
 *
 * Maps emoji-prefixed commits to conventional commit format for automated versioning.
 * Based on the project's commit standards defined in CLAUDE.md and CONTRIBUTING.md
 */

export interface EmojiMapping {
  emoji: string;
  type: string;
  semverBump: 'major' | 'minor' | 'patch' | 'none';
  description: string;
}

/**
 * Comprehensive emoji to conventional commit type mapping
 * Aligned with .vscode/settings.json and project standards
 */
export const EMOJI_TO_CONVENTIONAL: Record<string, EmojiMapping> = {
  '✨': {
    emoji: '✨',
    type: 'feat',
    semverBump: 'minor',
    description: 'A new feature',
  },
  '🐛': {
    emoji: '🐛',
    type: 'fix',
    semverBump: 'patch',
    description: 'A bug fix',
  },
  '📦': {
    emoji: '📦',
    type: 'refactor',
    semverBump: 'none',
    description: 'A code change that neither fixes a bug nor adds a feature',
  },
  '🔧': {
    emoji: '🔧',
    type: 'ci',
    semverBump: 'none',
    description: 'Changes to our CI configuration files and scripts',
  },
  '🚧': {
    emoji: '🚧',
    type: 'chore',
    semverBump: 'none',
    description: 'Maintenance tasks',
  },
  '🧪': {
    emoji: '🧪',
    type: 'test',
    semverBump: 'none',
    description: 'Adding or correcting tests',
  },
  '✏️': {
    emoji: '✏️',
    type: 'docs',
    semverBump: 'none',
    description: 'Documentation only changes',
  },
  '📝': {
    emoji: '📝',
    type: 'docs',
    semverBump: 'none',
    description: 'Documentation only changes',
  },
  '🚀': {
    emoji: '🚀',
    type: 'perf',
    semverBump: 'patch',
    description: 'A code change that improves performance',
  },
  '💄': {
    emoji: '💄',
    type: 'style',
    semverBump: 'none',
    description: 'Changes that do not affect the meaning of the code',
  },
  '🏗️': {
    emoji: '🏗️',
    type: 'build',
    semverBump: 'none',
    description: 'Changes that affect the build system or external dependencies',
  },
  '⏪️': {
    emoji: '⏪️',
    type: 'revert',
    semverBump: 'patch',
    description: 'Reverts a previous commit',
  },
  '🌐': {
    emoji: '🌐',
    type: 'i18n',
    semverBump: 'none',
    description: 'Internationalization and localization',
  },
  '🎉': {
    emoji: '🎉',
    type: 'initial',
    semverBump: 'none',
    description: 'Initial commit',
  },
  '📈': {
    emoji: '📈',
    type: 'analytics',
    semverBump: 'none',
    description: 'Analytics-related changes',
  },
  '🗃️': {
    emoji: '🗃️',
    type: 'database',
    semverBump: 'none',
    description: 'Database-related changes',
  },
  '🔖': {
    emoji: '🔖',
    type: 'release',
    semverBump: 'none',
    description: 'Release / Version tags',
  },
};

/**
 * Regex pattern to match emoji-prefixed commits
 * Examples:
 * - ✨ feat(button): add new variant
 * - 🐛 fix(input): resolve focus issue
 * - 📦 refactor: improve performance
 */
const EMOJI_COMMIT_PATTERN = /^(✨|🐛|📦|🔧|🧪|✏️|📝|🚀|💄|🏗️|🚧|⏪️|🌐|🎉|📈|🗃️|🔖)\s+(\w+)(\([^)]+\))?(!)?: (.+)$/;

/**
 * Regex pattern to match conventional commits (without emoji)
 * Examples:
 * - feat(button): add new variant
 * - fix: resolve focus issue
 */
const CONVENTIONAL_COMMIT_PATTERN = /^(\w+)(\([^)]+\))?(!)?: (.+)$/;

export interface ParsedCommit {
  emoji?: string;
  type: string;
  scope?: string;
  breaking: boolean;
  subject: string;
  semverBump: 'major' | 'minor' | 'patch' | 'none';
  original: string;
}

/**
 * Parses a commit message and extracts its components
 */
export function parseCommit(message: string): ParsedCommit | null {
  const trimmed = message.trim();

  // Try to match emoji-prefixed commit
  const emojiMatch = trimmed.match(EMOJI_COMMIT_PATTERN);
  if (emojiMatch) {
    const [, emoji, type, scopeWithParens, breaking, subject] = emojiMatch;
    const scope = scopeWithParens?.replace(/[()]/g, '');

    const mapping = EMOJI_TO_CONVENTIONAL[emoji];
    if (!mapping) {
      console.warn(`Unknown emoji: ${emoji} in commit: ${message}`);
      return null;
    }

    return {
      emoji,
      type: mapping.type,
      scope,
      breaking: breaking === '!',
      subject: subject.trim(),
      semverBump: breaking === '!' ? 'major' : mapping.semverBump,
      original: trimmed,
    };
  }

  // Try to match conventional commit (without emoji)
  const conventionalMatch = trimmed.match(CONVENTIONAL_COMMIT_PATTERN);
  if (conventionalMatch) {
    const [, type, scopeWithParens, breaking, subject] = conventionalMatch;
    const scope = scopeWithParens?.replace(/[()]/g, '');

    // Find matching emoji for type
    const mapping = Object.values(EMOJI_TO_CONVENTIONAL).find(m => m.type === type);

    return {
      type,
      scope,
      breaking: breaking === '!',
      subject: subject.trim(),
      semverBump: breaking === '!' ? 'major' : mapping?.semverBump || 'none',
      original: trimmed,
    };
  }

  return null;
}

/**
 * Normalizes an emoji-prefixed commit to pure conventional commit format
 * Examples:
 * - "✨ feat(button): add variant" → "feat(button): add variant"
 * - "🐛 fix: resolve bug" → "fix: resolve bug"
 */
export function normalizeToConventional(message: string): string {
  const parsed = parseCommit(message);
  if (!parsed) {
    return message; // Return as-is if cannot parse
  }

  const scope = parsed.scope ? `(${parsed.scope})` : '';
  const breaking = parsed.breaking ? '!' : '';

  return `${parsed.type}${scope}${breaking}: ${parsed.subject}`;
}

/**
 * Determines if a commit should trigger a release
 */
export function shouldTriggerRelease(message: string): boolean {
  const parsed = parseCommit(message);
  if (!parsed) return false;

  return parsed.semverBump !== 'none';
}

/**
 * Gets the semver bump type for a commit
 */
export function getSemverBump(message: string): 'major' | 'minor' | 'patch' | 'none' {
  const parsed = parseCommit(message);
  return parsed?.semverBump || 'none';
}

/**
 * Batch normalize multiple commit messages
 */
export function normalizeCommits(messages: string[]): string[] {
  return messages.map(normalizeToConventional);
}
