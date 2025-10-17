#!/usr/bin/env tsx

/**
 * Release Detection Script
 *
 * Analyzes commits since the last release tag to determine if a new release is needed.
 * Outputs GitHub Actions compatible environment variables.
 */

import { execSync } from 'child_process';

import { getSemverBump, parseCommit } from './emoji-commit-mapper.cts';

interface ReleaseAnalysis {
  shouldRelease: boolean;
  highestBump: 'major' | 'minor' | 'patch' | 'none';
  commitCount: number;
  featureCount: number;
  fixCount: number;
  commits: string[];
}

/**
 * Gets the latest git tag
 */
function getLatestTag(): string | null {
  try {
    const tag = execSync('git describe --tags --abbrev=0 2>/dev/null', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return tag || null;
  } catch {
    return null;
  }
}

/**
 * Gets all commits since the last tag (or all commits if no tag exists)
 */
function getCommitsSinceLastRelease(): string[] {
  const latestTag = getLatestTag();
  const range = latestTag ? `${latestTag}..HEAD` : 'HEAD';

  try {
    const commits = execSync(`git log ${range} --pretty=format:"%s" --no-merges`, {
      encoding: 'utf-8',
    });

    return commits.split('\n').filter(c => c.trim().length > 0);
  } catch (error) {
    console.error('Error getting commits:', error);
    return [];
  }
}

/**
 * Analyzes commits to determine if a release is needed
 */
function analyzeCommits(commits: string[]): ReleaseAnalysis {
  let highestBump: 'major' | 'minor' | 'patch' | 'none' = 'none';
  let featureCount = 0;
  let fixCount = 0;

  for (const commit of commits) {
    const bump = getSemverBump(commit);
    const parsed = parseCommit(commit);

    // Track feature and fix counts
    if (parsed?.type === 'feat') featureCount++;
    if (parsed?.type === 'fix') fixCount++;

    // Determine highest bump
    if (bump === 'major') {
      highestBump = 'major';
    } else if (bump === 'minor' && highestBump !== 'major') {
      highestBump = 'minor';
    } else if (bump === 'patch' && highestBump === 'none') {
      highestBump = 'patch';
    }
  }

  const shouldRelease = highestBump !== 'none';

  return {
    shouldRelease,
    highestBump,
    commitCount: commits.length,
    featureCount,
    fixCount,
    commits,
  };
}

/**
 * Sets GitHub Actions output
 */
function setGitHubOutput(key: string, value: string) {
  const output = process.env.GITHUB_OUTPUT;
  if (output) {
    const fs = require('fs');
    fs.appendFileSync(output, `${key}=${value}\n`);
  }
  console.log(`::set-output name=${key}::${value}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Analyzing commits for release detection...\n');

  const latestTag = getLatestTag();
  console.log(`📌 Latest tag: ${latestTag || 'none (first release)'}`);

  const commits = getCommitsSinceLastRelease();
  console.log(`📊 Found ${commits.length} commit(s) since last release\n`);

  if (commits.length === 0) {
    console.log('⏭️  No commits found - skipping release');
    setGitHubOutput('should_release', 'false');
    setGitHubOutput('bump_type', 'none');
    return;
  }

  const analysis = analyzeCommits(commits);

  console.log('📈 Analysis Results:');
  console.log(`   • Features: ${analysis.featureCount}`);
  console.log(`   • Fixes: ${analysis.fixCount}`);
  console.log(`   • Highest bump: ${analysis.highestBump}`);
  console.log(`   • Should release: ${analysis.shouldRelease ? 'YES ✅' : 'NO ❌'}\n`);

  if (analysis.shouldRelease) {
    console.log('Recent commits that trigger release:');
    commits.slice(0, 5).forEach(commit => {
      const bump = getSemverBump(commit);
      if (bump !== 'none') {
        console.log(`   • [${bump}] ${commit}`);
      }
    });
    console.log('');
  }

  // Set GitHub Actions outputs
  setGitHubOutput('should_release', analysis.shouldRelease ? 'true' : 'false');
  setGitHubOutput('bump_type', analysis.highestBump);
  setGitHubOutput('feature_count', analysis.featureCount.toString());
  setGitHubOutput('fix_count', analysis.fixCount.toString());

  // Exit with appropriate code
  process.exit(0);
}

main();
