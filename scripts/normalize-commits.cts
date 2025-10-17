#!/usr/bin/env tsx

/**
 * Commit Normalization Script
 *
 * This script helps Nx Release understand emoji-prefixed commits by normalizing them
 * to pure conventional commit format. It's used in the preVersionCommand.
 *
 * Note: This doesn't modify the actual git history, it just helps Nx analyze commits.
 */

import { execSync } from 'child_process';

import { normalizeToConventional, parseCommit } from './emoji-commit-mapper.cts';

interface CommitInfo {
  hash: string;
  message: string;
  normalized: string;
  valid: boolean;
}

/**
 * Gets commits since last tag for analysis
 */
function getCommitsSinceLastTag(): CommitInfo[] {
  try {
    // Get latest tag
    let latestTag: string | null = null;
    try {
      latestTag = execSync('git describe --tags --abbrev=0 2>/dev/null', {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
    } catch {
      // No tags yet
    }

    const range = latestTag ? `${latestTag}..HEAD` : 'HEAD';

    // Get commits with hash and message
    const output = execSync(`git log ${range} --pretty=format:"%H|%s" --no-merges`, {
      encoding: 'utf-8',
    });

    if (!output.trim()) {
      return [];
    }

    return output
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, message] = line.split('|');
        const normalized = normalizeToConventional(message);
        const valid = parseCommit(message) !== null;

        return {
          hash: hash.trim(),
          message: message.trim(),
          normalized,
          valid,
        };
      });
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}

/**
 * Validates commit format and provides feedback
 */
function validateCommits(commits: CommitInfo[]): boolean {
  const invalid = commits.filter(c => !c.valid);

  if (invalid.length > 0) {
    console.warn('\n⚠️  Warning: Found commits with non-standard format:\n');
    invalid.forEach(c => {
      console.warn(`   ${c.hash.substring(0, 7)} - ${c.message}`);
    });
    console.warn('\n   These commits will be included but may not affect versioning.');
    console.warn('   Please use the commit format: emoji type(scope): description\n');
  }

  return true; // Don't block release, just warn
}

/**
 * Displays normalization summary
 */
function displaySummary(commits: CommitInfo[]) {
  console.log('📊 Commit Normalization Summary:\n');
  console.log(`   Total commits: ${commits.length}`);
  console.log(`   Valid format: ${commits.filter(c => c.valid).length}`);
  console.log(`   Invalid format: ${commits.filter(c => !c.valid).length}`);

  const examples = commits.filter(c => c.valid && c.message !== c.normalized).slice(0, 3);

  if (examples.length > 0) {
    console.log('\n   Normalization examples:');
    examples.forEach(c => {
      console.log(`   • Original:   ${c.message}`);
      console.log(`     Normalized: ${c.normalized}`);
    });
  }

  console.log('');
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Normalizing commits for Nx Release...\n');

  const commits = getCommitsSinceLastTag();

  if (commits.length === 0) {
    console.log('✅ No commits to process since last release\n');
    return;
  }

  displaySummary(commits);
  validateCommits(commits);

  // Nx Release will handle the actual versioning based on git log
  // This script just validates and provides feedback
  console.log('✅ Commit analysis complete. Nx Release can proceed.\n');
}

main();
