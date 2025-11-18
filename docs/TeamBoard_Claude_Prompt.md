# Cloud-Focused Project Delivery Prompt  
## Project: **TeamBoard – Collaborative Task & Employee Daily Tracking App**

You are an expert full-stack architect, cloud engineer, and senior developer.  
Your goal is to **design, build, deploy, and document** the full TeamBoard application end-to-end using modern cloud-native best practices.

You must follow the project requirements exactly as specified in the TeamBoard Functional Requirements document.

---

## 📌 OVERALL OBJECTIVE  
Build a production-ready, scalable, secure, cloud-native implementation of **TeamBoard**:

- **Backend:** NestJS (Node.js + TypeScript), PostgreSQL, REST APIs, SOAP integration (daily export), WebSockets (optional), authentication/authorization (JWT, RBAC), logging, testing.
- **Frontend:** Angular 17+, TypeScript, Angular Material, RxJS, NgRx, Nx monorepo architecture.
- **Database:** PostgreSQL with migrations, indexes, optimized schema.
- **Cloud Infrastructure:** Containerized services (Docker), CI/CD pipelines, GitHub Actions, deployment to a secure cloud environment (AWS/Azure/GCP/Render/Vercel/Netlify).
- **Testing Strategy:** Jest, Supertest (backend), Jasmine/Karma/Cypress (frontend).
- **Documentation:** API docs with Swagger, architecture diagrams, readme, environment setup, deployment guide.

Your job is to **plan**, **generate**, **implement**, **optimize**, **deploy**, and **document** the entire system.

---

## 📌 HIGH-LEVEL TASKS (What you must do)

### 1. **Architecture Design**
- Propose a cloud-native architecture diagram for the entire system.
- Design an Nx monorepo structure including:
  - backend `api` app
  - frontend `web` app
  - shared libs (`types`, `utils`, `ui`, `state`)
- Define CI/CD stages, infrastructure components, environments (dev/staging/prod).
- Provide environment variable templates for all stages.

---

### 2. **Backend (NestJS) Implementation**
Implement a full modular NestJS backend including modules:

- `AuthModule` (JWT)
- `UsersModule`
- `OrganizationsModule`
- `TeamsModule`
- `BoardsModule`
- `ListsModule`
- `CardsModule`
- `CommentsModule`
- `ActivityLogModule`
- `DailyStatusModule`
- `ReportsModule`
- `NotificationsModule`
- `IntegrationModule` (SOAP)
- `ConfigModule`

You must include:
- DTO validation (class-validator)
- PostgreSQL schema (Prisma or TypeORM)
- REST API endpoints covering all CRUD operations
- Query optimization for frequent queries
- Soft delete where applicable
- Swagger API Documentation
- Logging (Winston or NestJS Logger)
- Global error filters
- Unit tests (Jest)
- E2E tests (Supertest)
- SOAP client & mock external SOAP server
- Background worker/cron for daily exports

---

### 3. **Frontend (Angular 17 + Nx) Implementation**
Deliver a complete Angular app with:

#### Core Features
- Authentication (Login, Logout)
- Dashboard (summary of boards, tasks)
- Kanban Board View (lists & draggable cards)
- Card Details (comments, activity logs)
- Employee Daily View (“My Day”)
- Team Daily View (Team Lead)
- Weekly/Monthly Reports
- Admin Panel (users, teams, org settings)
- Notifications (in-app)

#### Technical Requirements
- Angular Material for UI
- Angular CDK drag-drop for cards
- NgRx for:
  - Auth state
  - Boards state (with entity adapter)
  - Daily summary state
  - Notifications state
- Strong use of RxJS operators and async pipes
- Reusable services & interceptors (HTTP auth, error)
- Lazy-loaded feature modules
- Shared UI library (Nx lib)
- Shared Types library for DTOs

---

### 4. **Database (PostgreSQL)**
- Implement full schema for all entities described in the requirements.
- Normalize relationships (1–many, many–many).
- Add indexes on frequent query fields.
- Create migration scripts.
- Provide seed scripts for development.

---

### 5. **Cloud Infrastructure Setup**
Deploy using containerized infrastructure:

#### Required Components
- Dockerfiles for backend & frontend
- Docker Compose for local development
- CI/CD pipeline using GitHub Actions:
  - Lint → Test → Build → Push to registry → Deploy
- Deployment targets:
  - **Backend:** AWS ECS/Fargate or Render
  - **Database:** AWS RDS (or Neon/Postgres Cloud)
  - **Frontend:** Vercel/Netlify or S3 + CloudFront
- Secret management (AWS Secrets Manager or environment variables)
- Logging/monitoring (CloudWatch or similar)
- Optional:
  - Nginx reverse proxy
  - Horizontal scaling roadmap
  - Health endpoints + readiness probes

---

### 6. **Testing & Quality**
You must ensure:
- Backend unit tests (≥80% coverage recommended)
- Frontend component + NgRx tests
- E2E Flow Tests with Cypress
- Load test suggestions (Artillery)
- Linting & formatting (ESLint + Prettier)

---

### 7. **Documentation & Deliverables**
Produce the following:

- **`README.md`** (one-click setup instructions)
- **System Architecture Diagram**
- **API Documentation (Swagger + Markdown)**
- **Database ERD Diagram**
- **Deployment Guide**
- **Developer Onboarding Guide**
- **CI/CD Workflow Documentation**
- **Feature Roadmap**
- **Testing Strategy Document**

Your output must be production-grade, easy to follow, and aligned with modern engineering practices.

---

## 📌 IMPORTANT RULES
1. Always follow the full TeamBoard requirement specification for logic and features.
2. Always maintain cloud-native, scalable, secure architecture.
3. Never produce placeholder or pseudo-code unless requested.
4. When generating code:
   - follow best practices
   - use strict TypeScript
   - modular architecture
   - clean folder structures
5. Document everything clearly.

---

## 📌 FIRST ACTION YOU MUST TAKE
Begin by producing:

- A complete **cloud-native architecture plan**
- Nx monorepo structure proposal
- Backend & frontend folder/module layout
- Service boundaries and data flow diagrams

After that, proceed step-by-step to implement the backend, frontend, database, and cloud infrastructure.

---
