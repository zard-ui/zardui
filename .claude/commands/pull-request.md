Generate a pull request description for a component using the project's PR template.

# Command Claude

This command generates a comprehensive pull request description for component changes based on the `.github/pull_request_template.md` template. You should return using markdown format.

## What it does:

1. Analyzes the current git changes and component modifications
2. Generates a structured PR description following the project template
3. Includes relevant sections like:
   - What was done
   - Screenshots/Implementation details
   - Link to related issue
   - Type of change checkboxes
   - Breaking changes (if any)
   - Testing checklist

## Usage:

When you want to create a pull request for component changes, use this command to generate a well-structured description that follows the project's standards and includes all necessary information for reviewers.

## Template Structure:

The generated description will follow this format:

- **What was done**: Clear explanation of changes
- **Screenshots or GIFs**: Placeholder for visual comparisons
- **Link to Issue**: Connection to related GitHub issue
- **Type of change**: Checkboxes for categorizing the PR
- **Breaking change**: Documentation of any breaking changes
- **Checklist**: Browser compatibility and testing verification
