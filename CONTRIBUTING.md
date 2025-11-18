# Contributing to TeamBoard

Thank you for your interest in contributing to TeamBoard! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Project Structure](#project-structure)

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

---

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/team-board.git
cd team-board

# Add upstream remote
git remote add upstream https://github.com/sayeed007/team-board.git
```

### 2. Set Up Development Environment

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start PostgreSQL
cd ..
docker-compose up -d postgres

# Run migrations
cd backend
npx prisma migrate dev
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## Development Process

### Running the Application

**Backend**:
```bash
cd backend
npm run start:dev  # Starts on port 3000
```

**Frontend**:
```bash
cd frontend
npm start  # Starts on port 4200
```

### Making Changes

1. Make your changes in the appropriate directory (`backend/` or `frontend/`)
2. Write or update tests
3. Run tests to ensure they pass
4. Test manually in the browser
5. Commit your changes

---

## Pull Request Process

### 1. Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Tests have been added/updated
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation has been updated if needed
- [ ] Commit messages follow the convention

### 2. Submit Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template

3. **PR Title Format**
   ```
   feat: Add user profile page
   fix: Resolve login redirect issue
   docs: Update API documentation
   ```

### 3. PR Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged
- Delete your branch after merge

### 4. Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your local main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

## Coding Standards

### Backend (NestJS/TypeScript)

**Style Guide**:
- Use TypeScript strict mode
- Follow NestJS module pattern
- Use DTOs for request/response validation
- Add JSDoc comments for public APIs

**Example**:
```typescript
/**
 * Creates a new board for the organization
 * @param createBoardDto - Board creation data
 * @param organizationId - Organization ID from JWT
 * @returns Created board with lists
 */
@Post()
async create(
  @Body() createBoardDto: CreateBoardDto,
  @Request() req,
): Promise<Board> {
  return this.boardsService.create(createBoardDto, req.user.organizationId);
}
```

**Naming Conventions**:
- Files: `kebab-case.service.ts`
- Classes: `PascalCase`
- Methods/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Frontend (Angular/TypeScript)

**Style Guide**:
- Use standalone components (Angular 17+)
- Follow reactive programming with RxJS
- Use OnPush change detection when possible
- Keep components focused and small

**Example**:
```typescript
@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardListComponent implements OnInit {
  boards$ = this.apiService.getBoards();

  constructor(private apiService: ApiService) {}
}
```

**Naming Conventions**:
- Files: `kebab-case.component.ts`
- Components: `PascalCaseComponent`
- Services: `PascalCaseService`
- Selectors: `app-kebab-case`

### General Rules

- **Maximum line length**: 100 characters
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Quotes**: Single quotes for TS, double for HTML
- **Trailing commas**: Yes

---

## Testing Guidelines

### Backend Tests

**Unit Tests** (`*.spec.ts`):
```typescript
describe('BoardsService', () => {
  let service: BoardsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BoardsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should create a board', async () => {
    const result = await service.create(mockDto, 'org-1');
    expect(result).toHaveProperty('id');
  });
});
```

**E2E Tests** (`*.e2e-spec.ts`):
```typescript
describe('Boards (e2e)', () => {
  it('/boards (POST)', () => {
    return request(app.getHttpServer())
      .post('/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Board' })
      .expect(201);
  });
});
```

### Frontend Tests

**Component Tests**:
```typescript
describe('BoardListComponent', () => {
  let component: BoardListComponent;
  let fixture: ComponentFixture<BoardListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BoardListComponent],
    });
    fixture = TestBed.createComponent(BoardListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Running Tests

```bash
# Backend
cd backend
npm test                # Unit tests
npm run test:e2e        # E2E tests
npm run test:cov        # Coverage

# Frontend
cd frontend
npm test                # Unit tests
npm run test:coverage   # Coverage
```

### Test Coverage Requirements

- Aim for **80%** coverage for new code
- All new features must have tests
- Bug fixes should include regression tests

---

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements

### Examples

```bash
feat(boards): add drag-and-drop for cards

- Implement Angular CDK drag-and-drop
- Add move card API endpoint
- Update board detail component

Closes #123
```

```bash
fix(auth): resolve JWT token expiration issue

The token was expiring too quickly due to incorrect
configuration in the JWT service.

Fixes #456
```

### Rules

- Use imperative mood ("add" not "added")
- Don't capitalize first letter of subject
- No period at the end of subject
- Keep subject under 50 characters
- Separate subject from body with blank line
- Wrap body at 72 characters

---

## Project Structure

### Backend (`backend/`)

```
src/
├── auth/           # Authentication & JWT
├── users/          # User management
├── boards/         # Board CRUD
├── cards/          # Card management
├── lists/          # List management
├── prisma/         # Database service
└── main.ts         # Application entry
```

### Frontend (`frontend/src/app/`)

```
app/
├── core/           # Singleton services, guards
│   ├── services/   # API, auth services
│   └── interceptors/
├── shared/         # Shared models, utils
│   └── models/
└── features/       # Feature modules
    ├── auth/       # Login, register
    ├── boards/     # Board management
    └── dashboard/  # Dashboard
```

---

## Common Tasks

### Adding a New Backend Module

```bash
cd backend
nest g module my-feature
nest g controller my-feature
nest g service my-feature
```

### Adding a New Frontend Component

```bash
cd frontend
ng g component features/my-feature
ng g service core/services/my-feature
```

### Updating Database Schema

```bash
cd backend

# 1. Modify prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_my_feature

# 3. Generate client
npx prisma generate
```

### Adding Dependencies

```bash
# Backend
cd backend
npm install package-name
npm install -D @types/package-name

# Frontend
cd frontend
npm install package-name
```

---

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/sayeed007/team-board/discussions)
- **Bugs**: Create an [Issue](https://github.com/sayeed007/team-board/issues)
- **Documentation**: Check [docs/](docs/) folder
- **Examples**: Look at existing code

---

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes
- README acknowledgments (for significant contributions)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TeamBoard! 🎉
