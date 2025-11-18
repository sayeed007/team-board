# TeamBoard - Cloud-Native Architecture Plan

## 1. System Overview

TeamBoard is a cloud-native, microservices-ready application built with:
- **Backend**: NestJS (Node.js + TypeScript)
- **Frontend**: Angular 17+ with NgRx state management
- **Database**: PostgreSQL (AWS RDS / Neon / Cloud provider)
- **Monorepo**: Nx workspace
- **Deployment**: Containerized (Docker) on cloud infrastructure

---

## 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Angular 17 SPA (Vercel/Netlify/S3+CloudFront)          │   │
│  │  - Angular Material UI                                   │   │
│  │  - NgRx State Management                                 │   │
│  │  - RxJS Reactive Streams                                 │   │
│  │  - Lazy-loaded Modules                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/REST
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / LOAD BALANCER                 │
│                  (AWS ALB / Nginx / Cloud LB)                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION TIER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  NestJS Backend API (AWS ECS/Fargate/Render)            │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐       │   │
│  │  │Auth Module │  │Board Module│  │Daily Status  │       │   │
│  │  └────────────┘  └────────────┘  └──────────────┘       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐       │   │
│  │  │User Module │  │Card Module │  │Reports Module│       │   │
│  │  └────────────┘  └────────────┘  └──────────────┘       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐       │   │
│  │  │Org Module  │  │Integration │  │Notifications │       │   │
│  │  └────────────┘  │(SOAP)      │  └──────────────┘       │   │
│  │                  └────────────┘                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATA TIER                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database (AWS RDS/Azure DB/Cloud SQL)       │   │
│  │  - Optimized indexes                                     │   │
│  │  - Connection pooling                                    │   │
│  │  - Automated backups                                     │   │
│  │  - Read replicas (future scaling)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  External SOAP Service (HR/Timesheet System)            │   │
│  │  - Receives daily employee summaries                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE & OPERATIONS                      │
│  ┌─────────────┐ ┌──────────────┐ ┌───────────────┐            │
│  │GitHub       │ │CloudWatch/   │ │AWS Secrets/   │            │
│  │Actions CI/CD│ │Logging       │ │Environment    │            │
│  └─────────────┘ └──────────────┘ └───────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Backend
- **Framework**: NestJS 10+
- **Language**: TypeScript 5+
- **Runtime**: Node.js 20 LTS
- **Database**: PostgreSQL 15+
- **ORM**: Prisma (recommended) or TypeORM
- **Authentication**: JWT (jsonwebtoken + passport-jwt)
- **Validation**: class-validator, class-transformer
- **Testing**: Jest (unit), Supertest (E2E)
- **SOAP**: node-soap
- **Logging**: Winston or NestJS Logger
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 17+
- **Language**: TypeScript 5+
- **State Management**: NgRx 17+
- **UI Library**: Angular Material 17+
- **Drag & Drop**: Angular CDK
- **HTTP**: Angular HttpClient + RxJS
- **Testing**: Jest + Jasmine + Cypress
- **Build Tool**: Nx + esbuild

### Infrastructure
- **Monorepo**: Nx 18+
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Backend Hosting**: AWS ECS/Fargate, Render, or Railway
- **Frontend Hosting**: Vercel, Netlify, or AWS S3+CloudFront
- **Database**: AWS RDS (PostgreSQL), Neon, or Supabase
- **Secrets**: AWS Secrets Manager / Environment Variables
- **Monitoring**: CloudWatch, Datadog, or Sentry

---

## 4. Deployment Architecture

### Development Environment
```
Developer Machine
  ↓
Docker Compose
  ├─ PostgreSQL (localhost:5432)
  ├─ NestJS API (localhost:3000)
  └─ Angular Dev Server (localhost:4200)
```

### Production Environment
```
GitHub Repository
  ↓
GitHub Actions CI/CD
  ├─ Lint & Test
  ├─ Build Docker Images
  ├─ Push to Container Registry (ECR/Docker Hub)
  └─ Deploy
      ├─ Frontend → Vercel/Netlify (or S3+CloudFront)
      └─ Backend → AWS ECS/Fargate (or Render)
           └─ PostgreSQL RDS
```

---

## 5. Security Architecture

### Authentication Flow
```
User Login
  ↓
POST /auth/login (email + password)
  ↓
Backend validates credentials (bcrypt)
  ↓
Generate JWT token (with user id, org id, role)
  ↓
Return token to client
  ↓
Client stores token (localStorage or memory)
  ↓
All subsequent requests include:
  Authorization: Bearer <token>
  ↓
Backend JWT Guard validates token
  ↓
Role-based access control (RBAC) checks
  ↓
Allow/Deny request
```

### Security Measures
- **Password Hashing**: bcrypt (salt rounds: 10)
- **JWT Expiry**: 1 hour (configurable)
- **Refresh Tokens**: Optional (future enhancement)
- **HTTPS Only**: SSL/TLS certificates (Let's Encrypt / AWS ACM)
- **CORS**: Configured to allow only frontend domain
- **Rate Limiting**: Throttler guard in NestJS
- **SQL Injection Protection**: Parameterized queries via Prisma/TypeORM
- **XSS Protection**: Angular's built-in sanitization
- **Secrets Management**: Never commit secrets; use environment variables

---

## 6. Database Architecture

### Schema Design Principles
- Normalized relational schema (3NF)
- Soft deletes where applicable (`deleted_at` timestamp)
- Audit fields: `created_at`, `updated_at`, `created_by`, `updated_by`
- Foreign key constraints for referential integrity
- Indexes on frequently queried fields

### Key Relationships
```
Organization 1──→ Many Users
Organization 1──→ Many Teams
Organization 1──→ Many Boards

Team Many ←──→ Many Users (TeamMember join table)
Board Many ←──→ Many Users (BoardMember join table)

Board 1 ──→ Many Lists
List 1 ──→ Many Cards

Card Many ──→ One User (assignee)
Card 1 ──→ Many Comments
Card 1 ──→ Many ActivityLogs

User 1 ──→ Many DailyStatus (one per day)
User 1 ──→ Many Notifications
```

---

## 7. API Architecture

### REST API Design
- **Base URL**: `https://api.teamboard.com/v1`
- **Authentication**: JWT via `Authorization: Bearer <token>`
- **Response Format**: JSON
- **Error Format**:
  ```json
  {
    "statusCode": 400,
    "message": "Validation failed",
    "errors": [...]
  }
  ```

### API Modules
- `/auth` - Authentication endpoints
- `/users` - User management
- `/organizations` - Organization settings
- `/teams` - Team CRUD
- `/boards` - Board management
- `/boards/:id/lists` - Lists within a board
- `/boards/:id/cards` - Cards within a board
- `/cards/:id/comments` - Comments on a card
- `/cards/:id/activity` - Activity log for a card
- `/daily-status` - Employee daily check-ins
- `/employee/:id/daily-summary` - Daily summary per employee
- `/team/:id/daily-summary` - Team daily overview
- `/reports` - Weekly/monthly reports
- `/notifications` - User notifications
- `/integrations/daily-summary/export` - SOAP export trigger

---

## 8. State Management (NgRx)

### State Slices
```
AppState
├─ auth: AuthState
│   ├─ user: User | null
│   ├─ token: string | null
│   ├─ loading: boolean
│   └─ error: string | null
│
├─ boards: BoardsState
│   ├─ entities: { [id]: Board }
│   ├─ selectedBoardId: string | null
│   ├─ loading: boolean
│   └─ error: string | null
│
├─ lists: ListsState (normalized by board)
├─ cards: CardsState (normalized by list)
├─ users: UsersState
├─ dailyView: DailyViewState
│   ├─ summaries: DailySummary[]
│   ├─ selectedDate: string
│   └─ loading: boolean
│
└─ notifications: NotificationsState
    ├─ items: Notification[]
    ├─ unreadCount: number
    └─ loading: boolean
```

---

## 9. CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    - Checkout code
    - Setup Node.js
    - Install dependencies (npm ci)
    - Lint (nx affected:lint)
    - Test backend (nx test api)
    - Test frontend (nx test web)
    - E2E tests (nx e2e)

  build:
    - Build backend (nx build api)
    - Build frontend (nx build web)
    - Build Docker images
    - Push to ECR/Docker Hub

  deploy:
    - Deploy frontend to Vercel/Netlify
    - Deploy backend to AWS ECS/Render
    - Run database migrations
    - Health check
```

---

## 10. Scalability Considerations

### Horizontal Scaling
- Backend API: Stateless containers (ECS tasks, multiple instances)
- Load balancer distributes traffic
- Database connection pooling (PgBouncer)

### Caching Strategy (Future)
- Redis for:
  - Session storage
  - Frequently accessed data (boards, users)
  - Rate limiting counters

### Performance Optimizations
- Database indexes on:
  - `organization_id`, `team_id`, `board_id`
  - `assignee_id`, `due_date`, `status`
- Pagination for lists (boards, cards, activity logs)
- Lazy loading in Angular (feature modules)
- CDN for static assets

---

## 11. Monitoring & Observability

### Logging
- **Backend**: Winston logger with structured JSON logs
- **Levels**: ERROR, WARN, INFO, DEBUG
- **Log Aggregation**: CloudWatch Logs / Datadog

### Metrics
- API response times
- Database query performance
- Error rates
- Active user sessions

### Health Checks
- `/health` endpoint (NestJS TerminusModule)
- Database connectivity check
- External service checks (SOAP endpoint)

---

## 12. Development Workflow

### Local Development
1. Clone repository
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Run `docker-compose up -d` (PostgreSQL)
5. Run `npx prisma migrate dev`
6. Run `nx serve api` (backend on :3000)
7. Run `nx serve web` (frontend on :4200)

### Branching Strategy
- `main` - production-ready code
- `develop` - integration branch
- `feature/xxx` - feature branches
- `hotfix/xxx` - urgent fixes

### Code Review Process
- All changes via Pull Requests
- CI must pass (lint, tests)
- At least 1 approval required

---

## 13. Future Enhancements Roadmap

### Phase 2 (Post-MVP)
- WebSocket real-time updates
- File attachments for cards
- Advanced reporting with charts (Chart.js/D3.js)
- Email notifications (SendGrid/AWS SES)

### Phase 3
- Mobile app (React Native / Ionic)
- Integration with Slack/Teams
- Calendar sync (Google/Outlook)
- Advanced permissions (custom roles)

### Phase 4
- AI-powered insights (task estimation, workload balancing)
- Multi-language support (i18n)
- Offline support (PWA)

---

## 14. Cost Estimation (Monthly, Low-Traffic)

| Service | Provider | Estimated Cost |
|---------|----------|----------------|
| Backend Hosting | Render / AWS ECS | $7-25 |
| Database | Neon / AWS RDS (t3.micro) | $15-30 |
| Frontend Hosting | Vercel / Netlify | $0 (free tier) |
| Domain & SSL | Cloudflare / Route53 | $1-2 |
| Monitoring | CloudWatch / Sentry free tier | $0-10 |
| **Total** | | **$23-67/month** |

For production scale, costs increase based on usage (compute, storage, bandwidth).

---

## 15. Success Metrics

- **Performance**: API response time < 300ms (p95)
- **Reliability**: 99.5% uptime
- **Security**: Zero critical vulnerabilities
- **Test Coverage**: ≥ 80% for backend, ≥ 70% for frontend
- **User Experience**: Core user flows functional and intuitive

---

## Summary

This architecture provides a **production-ready, scalable, secure foundation** for TeamBoard. It follows modern cloud-native best practices, uses industry-standard tools, and is designed for easy development, testing, deployment, and future growth.

**Next Steps**:
1. Set up Nx monorepo structure
2. Implement backend modules
3. Build frontend application
4. Configure CI/CD pipeline
5. Deploy to cloud infrastructure
