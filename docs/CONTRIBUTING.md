# Contributing to YouTube Video Recommender

Thank you for your interest in contributing! This document outlines the process and guidelines.

## Code of Conduct

Be respectful, inclusive, and helpful to other contributors.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a branch for your feature: `git checkout -b feature/my-feature`
4. Follow the setup guide in `docs/SETUP.md`

## Development Workflow

### 1. Pick an Issue or Feature

- Check existing [Issues](https://github.com/shubhamcodecc-ctrl/expert-broccoli/issues)
- Pick one or create a new issue
- Comment to let others know you're working on it

### 2. Create a Branch

```bash
git checkout -b feature/my-feature-name
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/improvement
```

### 3. Make Changes

Follow these guidelines:

- **Commits**: Write clear, descriptive commit messages
  ```
  feat: add video search functionality
  fix: resolve recommendation algorithm edge case
  docs: update API documentation
  refactor: simplify preference validation
  test: add tests for user preference service
  ```

- **Code Style**: 
  - Use TypeScript (no `any` without reason)
  - Follow existing code patterns
  - Use ESLint and Prettier
  ```bash
  npm run format  # Auto-format code
  npm run lint    # Check for issues
  ```

- **Comments**: Add JSDoc comments for public functions
  ```typescript
  /**
   * Calculate recommendation score for a video
   * @param userId - User identifier
   * @param videoId - Video identifier
   * @returns Computed score between 0 and 1
   */
  function getRecommendationScore(userId: string, videoId: string): number {
    // Implementation
  }
  ```

### 4. Write Tests

- Add tests for new features
- Ensure existing tests pass
- Aim for >80% coverage

```bash
npm run test              # Run all tests
npm run backend:test      # Backend tests only
npm run extension:test    # Extension tests only
```

### 5. Update Documentation

- Update README.md if behavior changes
- Add API documentation for new endpoints
- Update ARCHITECTURE.md if structure changes

### 6. Create Pull Request

```bash
git push origin feature/my-feature-name
```

Then create PR on GitHub with:
- Clear title: `feat: add video recommendations` or `fix: resolve scoring bug`
- Description of changes
- Link to related issues (e.g., `Closes #42`)
- Screenshots if UI changes

### 7. Code Review

- Respond to feedback
- Make requested changes
- Re-request review once updated

### 8. Merge

Once approved, maintainer will merge. Squash commits when merging.

## Project Structure

### Backend

```
backend/src/
├── controllers/      # Route handlers
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # Business logic
├── middleware/      # Auth, validation
└── config/          # Configuration
```

### Extension

```
extension/src/
├── components/      # React components
├── background/      # Service worker
├── content/         # Content script
├── popup/           # Popup UI
├── options/         # Settings page
└── utils/           # Utilities
```

## Testing Guidelines

### Backend Tests

Use Jest with Supertest for API tests:

```typescript
describe('GET /api/videos/recommendations', () => {
  it('should return recommendations for authenticated user', async () => {
    const response = await request(app)
      .get('/api/videos/recommendations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

### Extension Tests

Use Jest with React Testing Library:

```typescript
test('should display recommendations in popup', () => {
  render(<Popup />);
  expect(screen.getByText(/recommendations/i)).toBeInTheDocument();
});
```

## Performance Considerations

- **Backend**: 
  - Index MongoDB queries appropriately
  - Cache recommendations (Redis if scaling)
  - Limit response payload size

- **Extension**:
  - Minimize background script startup time
  - Lazy-load components
  - Debounce API calls
  - Use IndexedDB for local caching

## Security Checklist

- [ ] No hardcoded secrets in code
- [ ] Input validation on all endpoints
- [ ] XSS protection in extension UI
- [ ] CSRF tokens for state-changing requests
- [ ] Rate limiting on API endpoints
- [ ] JWT token validation
- [ ] No sensitive data in logs

## Documentation Standards

- Use markdown for all docs
- Include code examples
- Keep README updated
- Document public APIs
- Add inline comments for complex logic

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:** feat, fix, docs, style, refactor, test, chore

**Scope:** backend, extension, ml, docs, etc.

**Subject:** Imperative, present tense, no period

**Body:** Explain what and why (not how)

**Footer:** References to issues (Closes #123)

**Example:**
```
feat(backend): implement recommendation algorithm

Implemented collaborative filtering with cosine similarity
to provide personalized video recommendations based on
user watch history and engagement metrics.

Closes #42
```

## Issues & Bug Reports

When reporting bugs:
1. Use descriptive title
2. Describe expected behavior
3. Describe actual behavior
4. Include reproduction steps
5. Include environment info (OS, browser, Node version)
6. Add screenshots/videos if applicable

## Feature Requests

1. Describe the feature
2. Explain the use case
3. Suggest implementation approach
4. Discuss alternatives

## Questions?

- Open a Discussion
- Comment on relevant Issue
- Check existing documentation

## License

By contributing, you agree your code is licensed under MIT License.

Thank you for contributing! 🎉
