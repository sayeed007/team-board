# TeamBoard - Nx Monorepo Structure

## Overview

This document defines the complete Nx workspace structure for TeamBoard, including applications, libraries, and shared code organization.

---

## 1. Workspace Layout

```
team-board/                          # Root workspace
├── .github/
│   └── workflows/
│       └── ci-cd.yml               # GitHub Actions CI/CD pipeline
│
├── apps/
│   ├── api/                        # NestJS Backend Application
│   │   ├── src/
│   │   │   ├── main.ts            # Bootstrap file
│   │   │   ├── app/
│   │   │   │   ├── app.module.ts  # Root module
│   │   │   │   ├── auth/          # Auth module
│   │   │   │   ├── users/         # Users module
│   │   │   │   ├── organizations/ # Organizations module
│   │   │   │   ├── teams/         # Teams module
│   │   │   │   ├── boards/        # Boards module
│   │   │   │   ├── lists/         # Lists module
│   │   │   │   ├── cards/         # Cards module
│   │   │   │   ├── comments/      # Comments module
│   │   │   │   ├── activity-log/  # Activity log module
│   │   │   │   ├── daily-status/  # Daily status module
│   │   │   │   ├── reports/       # Reports module
│   │   │   │   ├── notifications/ # Notifications module
│   │   │   │   ├── integrations/  # SOAP integration module
│   │   │   │   └── common/        # Common utilities
│   │   │   │       ├── guards/
│   │   │   │       ├── interceptors/
│   │   │   │       ├── filters/
│   │   │   │       └── decorators/
│   │   ├── test/
│   │   │   └── e2e/               # E2E tests
│   │   ├── prisma/                # Prisma schema & migrations
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── project.json
│   │
│   └── web/                        # Angular Frontend Application
│       ├── src/
│       │   ├── main.ts
│       │   ├── index.html
│       │   ├── styles.scss
│       │   ├── app/
│       │   │   ├── app.component.ts
│       │   │   ├── app.routes.ts
│       │   │   ├── app.config.ts
│       │   │   ├── core/          # Core module (singleton services)
│       │   │   │   ├── guards/
│       │   │   │   ├── interceptors/
│       │   │   │   └── services/
│       │   │   ├── layout/        # Layout components
│       │   │   │   ├── header/
│       │   │   │   ├── sidebar/
│       │   │   │   └── footer/
│       │   │   └── features/      # Feature modules (lazy-loaded)
│       │   │       ├── auth/
│       │   │       ├── dashboard/
│       │   │       ├── boards/
│       │   │       ├── daily-view/
│       │   │       ├── reports/
│       │   │       ├── admin/
│       │   │       └── notifications/
│       │   └── assets/
│       ├── Dockerfile
│       └── project.json
│
├── libs/
│   ├── shared/
│   │   ├── types/                  # Shared TypeScript types/interfaces/DTOs
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── lib/
│   │   │   │   │   ├── user.types.ts
│   │   │   │   │   ├── board.types.ts
│   │   │   │   │   ├── card.types.ts
│   │   │   │   │   ├── api-response.types.ts
│   │   │   │   │   └── ...
│   │   │   └── project.json
│   │   │
│   │   ├── ui/                     # Shared UI components (Angular)
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── lib/
│   │   │   │   │   ├── button/
│   │   │   │   │   ├── card/
│   │   │   │   │   ├── modal/
│   │   │   │   │   ├── form-field/
│   │   │   │   │   └── ...
│   │   │   └── project.json
│   │   │
│   │   ├── utils/                  # Shared utility functions
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── lib/
│   │   │   │   │   ├── date.utils.ts
│   │   │   │   │   ├── string.utils.ts
│   │   │   │   │   ├── validation.utils.ts
│   │   │   │   │   └── ...
│   │   │   └── project.json
│   │   │
│   │   └── config/                 # Shared configuration
│   │       ├── src/
│   │       │   ├── index.ts
│   │       │   └── lib/
│   │       │       ├── constants.ts
│   │       │       └── environment.ts
│   │       └── project.json
│   │
│   ├── backend/
│   │   ├── database/               # Database-related code
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── lib/
│   │   │   │       ├── prisma.service.ts
│   │   │   │       └── database.module.ts
│   │   │   └── project.json
│   │   │
│   │   └── testing/                # Backend testing utilities
│   │       ├── src/
│   │       │   ├── index.ts
│   │       │   └── lib/
│   │       │       ├── test-utils.ts
│   │       │       └── mock-data.ts
│   │       └── project.json
│   │
│   └── frontend/
│       ├── state/                  # NgRx state management
│       │   ├── src/
│       │   │   ├── index.ts
│       │   │   └── lib/
│       │   │       ├── auth/
│       │   │       │   ├── auth.actions.ts
│       │   │       │   ├── auth.reducer.ts
│       │   │       │   ├── auth.effects.ts
│       │   │       │   ├── auth.selectors.ts
│       │   │       │   └── auth.facade.ts
│       │   │       ├── boards/
│       │   │       ├── daily-view/
│       │   │       └── notifications/
│       │   └── project.json
│       │
│       └── data-access/            # API services
│           ├── src/
│           │   ├── index.ts
│           │   └── lib/
│           │       ├── auth.service.ts
│           │       ├── boards.service.ts
│           │       ├── cards.service.ts
│           │       ├── users.service.ts
│           │       └── ...
│           └── project.json
│
├── tools/
│   └── scripts/                    # Custom scripts
│       ├── seed-database.ts
│       └── generate-docs.ts
│
├── docker-compose.yml              # Local development environment
├── .env.example                    # Environment variables template
├── nx.json                         # Nx workspace configuration
├── package.json
├── tsconfig.base.json              # Base TypeScript config
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
└── README.md
```

---

## 2. Application Details

### 2.1 Backend API (`apps/api`)

**Technology**: NestJS + TypeScript + Prisma + PostgreSQL

**Structure**:
```
apps/api/src/app/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
│
├── boards/
│   ├── boards.module.ts
│   ├── boards.controller.ts
│   ├── boards.service.ts
│   └── dto/
│
├── cards/
│   ├── cards.module.ts
│   ├── cards.controller.ts
│   ├── cards.service.ts
│   └── dto/
│
├── daily-status/
│   ├── daily-status.module.ts
│   ├── daily-status.controller.ts
│   ├── daily-status.service.ts
│   └── dto/
│
├── integrations/
│   ├── integrations.module.ts
│   ├── soap/
│   │   ├── soap.service.ts
│   │   └── soap-client.ts
│   └── dto/
│
└── common/
    ├── guards/
    │   └── roles.guard.ts
    ├── interceptors/
    │   ├── logging.interceptor.ts
    │   └── transform.interceptor.ts
    ├── filters/
    │   └── http-exception.filter.ts
    └── decorators/
        ├── roles.decorator.ts
        └── user.decorator.ts
```

**Key Features**:
- Modular architecture (one module per domain)
- DTOs with class-validator
- Guards for authentication & authorization
- Swagger documentation
- Global error handling
- Request logging
- Database access via Prisma

---

### 2.2 Frontend Web (`apps/web`)

**Technology**: Angular 17+ + NgRx + Angular Material

**Structure**:
```
apps/web/src/app/
├── core/                           # Singleton services, loaded once
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   └── services/
│       └── theme.service.ts
│
├── layout/                         # Main layout components
│   ├── header/
│   │   ├── header.component.ts
│   │   ├── header.component.html
│   │   └── header.component.scss
│   ├── sidebar/
│   └── footer/
│
├── features/                       # Lazy-loaded feature modules
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   └── auth.routes.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   └── dashboard.routes.ts
│   │
│   ├── boards/
│   │   ├── board-list/
│   │   ├── board-detail/
│   │   │   ├── board-detail.component.ts
│   │   │   ├── list/
│   │   │   ├── card/
│   │   │   └── card-detail-dialog/
│   │   └── boards.routes.ts
│   │
│   ├── daily-view/
│   │   ├── my-day/
│   │   ├── team-daily-view/
│   │   └── daily-view.routes.ts
│   │
│   ├── reports/
│   │   ├── weekly-report/
│   │   ├── employee-report/
│   │   └── reports.routes.ts
│   │
│   ├── admin/
│   │   ├── users/
│   │   ├── teams/
│   │   ├── organization-settings/
│   │   └── admin.routes.ts
│   │
│   └── notifications/
│       ├── notification-list/
│       └── notifications.routes.ts
│
├── app.component.ts
├── app.routes.ts                   # Route configuration
└── app.config.ts                   # App configuration (providers)
```

**Key Features**:
- Standalone components (Angular 17+)
- Lazy-loaded routes
- NgRx for state management
- Angular Material components
- Reactive forms
- RxJS operators
- Responsive design

---

## 3. Shared Libraries

### 3.1 `libs/shared/types`
**Purpose**: Shared TypeScript interfaces, types, DTOs
**Consumers**: Both backend and frontend
**Example**:
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
}

export enum UserRole {
  ORG_ADMIN = 'ORG_ADMIN',
  TEAM_LEAD = 'TEAM_LEAD',
  EMPLOYEE = 'EMPLOYEE'
}
```

---

### 3.2 `libs/shared/ui`
**Purpose**: Reusable Angular UI components
**Consumers**: Frontend only
**Example Components**:
- Button
- Card
- Modal/Dialog
- Form Field
- Loader/Spinner
- Alert/Snackbar

---

### 3.3 `libs/shared/utils`
**Purpose**: Utility functions (date formatting, validators, etc.)
**Consumers**: Both backend and frontend
**Example**:
```typescript
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
```

---

### 3.4 `libs/frontend/state`
**Purpose**: NgRx state slices (actions, reducers, effects, selectors)
**Consumers**: Frontend only
**Structure**:
```
state/
├── auth/
│   ├── auth.actions.ts
│   ├── auth.reducer.ts
│   ├── auth.effects.ts
│   ├── auth.selectors.ts
│   └── auth.facade.ts
├── boards/
└── ...
```

---

### 3.5 `libs/frontend/data-access`
**Purpose**: API service layer (HTTP calls)
**Consumers**: Frontend only
**Example**:
```typescript
@Injectable()
export class BoardsService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>('/api/boards');
  }
}
```

---

### 3.6 `libs/backend/database`
**Purpose**: Database service (Prisma client)
**Consumers**: Backend only
**Example**:
```typescript
@Injectable()
export class PrismaService extends PrismaClient {}
```

---

## 4. Nx Commands

### Development
```bash
# Serve backend
nx serve api

# Serve frontend
nx serve web

# Serve both (use two terminals or nx run-many)
nx run-many --target=serve --projects=api,web
```

### Build
```bash
# Build backend
nx build api

# Build frontend
nx build web --configuration=production

# Build all
nx run-many --target=build --all
```

### Testing
```bash
# Test backend
nx test api

# Test frontend
nx test web

# E2E tests
nx e2e web-e2e

# Test affected projects only
nx affected:test
```

### Linting
```bash
# Lint backend
nx lint api

# Lint frontend
nx lint web

# Lint all
nx run-many --target=lint --all
```

### Code Generation
```bash
# Generate new library
nx g @nx/js:library my-lib --directory=libs/shared

# Generate NestJS module
nx g @nx/nest:module my-module --project=api

# Generate Angular component
nx g @angular/core:component my-component --project=web
```

---

## 5. Dependency Graph

```
apps/web
  ↓
libs/frontend/state
libs/frontend/data-access
libs/shared/ui
libs/shared/types
libs/shared/utils

apps/api
  ↓
libs/backend/database
libs/shared/types
libs/shared/utils
```

**View graph**:
```bash
nx graph
```

---

## 6. Environment Configuration

### Backend `.env`
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/teamboard
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
SOAP_ENDPOINT_URL=https://external-soap-service.com/endpoint
```

### Frontend `environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

---

## 7. Benefits of This Structure

1. **Separation of Concerns**: Clear boundaries between apps and libs
2. **Code Reusability**: Shared types/utils prevent duplication
3. **Scalability**: Easy to add new features/modules
4. **Maintainability**: Modular architecture, easy to navigate
5. **Testability**: Each module/lib can be tested independently
6. **Type Safety**: Shared types between backend and frontend
7. **Nx Benefits**:
   - Affected commands (only test/build what changed)
   - Dependency graph visualization
   - Consistent tooling across projects

---

## 8. Next Steps

1. Initialize Nx workspace:
   ```bash
   npx create-nx-workspace@latest team-board
   ```

2. Add NestJS app:
   ```bash
   nx g @nx/nest:app api
   ```

3. Add Angular app:
   ```bash
   nx g @angular/core:app web
   ```

4. Generate libraries as needed:
   ```bash
   nx g @nx/js:library types --directory=libs/shared
   ```

This structure sets up a robust, scalable foundation for TeamBoard development!
