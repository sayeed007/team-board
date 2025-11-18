# TeamBoard – Collaborative Task & Employee Daily Tracking App  
**Full Requirements Specification**

---

## 1. Overview

**Project Name:** TeamBoard  
**Tagline:** Collaborative Kanban boards + Employee daily task monitoring.  

TeamBoard is a web application that allows teams to:

- Organize work using **boards, lists, and cards** (Trello-style Kanban).
- Assign tasks to **employees** and track their **daily workload and progress**.
- View **per-employee “Today’s tasks”**, status, and blockers.
- Generate **daily/weekly reports** of employee workload and completed tasks.
- (Optional) Sync daily summaries to an **external HR/Timesheet system via SOAP**.

This project is designed to practice and showcase:

- **Backend:** Node.js, TypeScript, NestJS, PostgreSQL, REST, SOAP, Jest, logging.
- **Frontend:** Angular 17+, TypeScript, RxJS, NgRx, Angular Material, Nx monorepo.
- **Architecture:** Monorepo, modular design, state management, CI/CD readiness.

---

## 2. Goals & Non-Goals

### 2.1 Goals

- Provide a **Kanban-style task management** experience (boards, lists, cards).
- Support **employee-centric daily views** (e.g., “Tasks for Alice today”).
- Support basic **team collaboration**:
  - Assign tasks
  - Comments
  - Activity logs
- Implement **auth & role-based access control**.
- Provide **REST APIs** for all core features.
- Provide a **basic SOAP integration** to send daily summaries to an external system.
- Use **Nx** to organize backend + frontend + shared types in a single workspace.
- Use **NgRx** and **RxJS** for robust frontend state and data flow.

### 2.2 Non-Goals (for initial version)

- No real payment/billing system (just placeholders for “Pro” features).
- No complex permission matrix beyond simple roles.
- No offline support or mobile app initially.
- No complex real-time presence indicators (e.g., “user is typing”) – optional later.

---

## 3. User Roles & Personas

### 3.1 Roles

1. **Organization Admin**
   - Manages organization-level settings.
   - Manages employees (create, deactivate).
   - Manages teams, roles, and access to boards.
   - Views org-wide reports.

2. **Team Lead / Manager**
   - Creates & manages boards and lists.
   - Assigns tasks to employees.
   - Monitors team members’ daily tasks and progress.
   - Reviews daily status updates.

3. **Employee / Team Member**
   - Views assigned tasks.
   - Updates task status and estimates.
   - Logs daily progress and blockers.
   - Comments on tasks.

4. **System Admin (Optional / Internal)**
   - Technical admin for system configuration (for multi-tenant scenario).
   - Manages integrations (SOAP endpoint URL, API keys, etc.).

---

## 4. High-Level Features

1. **Authentication & User Management**
2. **Organizations, Teams & Employees**
3. **Boards, Lists & Cards (Kanban core)**
4. **Task Assignment & Employee Daily View**
5. **Comments & Activity Logs**
6. **Daily Status Updates & Reports**
7. **Notifications (Basic)**
8. **SOAP Integration for Daily Summary Export**
9. **Admin & Settings**
10. **Non-Functional: Security, Performance, Testing, Observability**

---

## 5. Detailed Functional Requirements

### 5.1 Authentication & User Management

#### 5.1.1 Features

- **User Registration (Org Admin)**
  - An Org Admin can create an organization and their own admin account.
  - Required fields: `name`, `email`, `password`, `organization_name`.
- **Login**
  - Users login with `email` + `password`.
  - On successful login, a **JWT** is issued.
- **Logout**
  - Frontend clears token; backend may maintain token blacklist (optional).
- **Password Management**
  - Change password (authenticated users).
  - Forgot password (basic placeholder or later implementation).
- **Role Management**
  - Roles: `ORG_ADMIN`, `TEAM_LEAD`, `EMPLOYEE`, `SYS_ADMIN` (optional).
  - Role is assigned when creating a user or updating user.

#### 5.1.2 Constraints & Rules

- Passwords stored as **hashed** (e.g., bcrypt).
- JWT tokens should have a reasonable expiry (e.g., 1h).
- Protected routes should require a valid JWT and role checks.

---

### 5.2 Organizations, Teams & Employees

#### 5.2.1 Organization

- Each organization has:
  - `id`, `name`, `created_at`, `settings`.
- An Org Admin belongs to exactly one organization.
- All users, teams, boards, tasks belong to an organization.

#### 5.2.2 Teams

- Teams group employees for boards and reporting.
- Fields: `id`, `organization_id`, `name`, `description`, `created_at`.
- Org Admin / Team Lead can:
  - Create / edit / delete teams.
  - Add / remove users from teams.

#### 5.2.3 Employees (Users)

- An employee is a user with role `EMPLOYEE` under a specific organization.
- Fields (user profile):
  - `id`, `organization_id`, `name`, `email`, `role`, `position`, `avatar_url`, `status (active/inactive)`.
- Org Admin can:
  - Invite new employees.
  - Deactivate employees (cannot log in, cannot be assigned new tasks).

---

### 5.3 Boards, Lists & Cards (Core Kanban)

#### 5.3.1 Boards

- Represent a project, sprint, or workflow.
- Fields:
  - `id`, `organization_id`, `team_id (optional)`, `name`, `description`, `created_by`, `created_at`, `is_archived`.
- Permissions:
  - Org Admin can see all boards.
  - Team Leads and Employees see boards they are added to (board membership).
- Actions:
  - Create, rename, archive board.
  - Add/remove members (users) to board.

#### 5.3.2 Lists (Columns)

- Represent pipeline stages (e.g., “To Do”, “In Progress”, “Done”).
- Fields:
  - `id`, `board_id`, `name`, `position`, `created_at`.
- Actions:
  - Create, update name.
  - Reorder lists within a board (drag-and-drop).
- Rules:
  - Position is an integer for ordering.
  - Deleting a list may be soft-delete or require moving cards first (configurable later).

#### 5.3.3 Cards (Tasks)

- Represent a task/issue assigned to one or more employees.
- Fields:
  - `id`, `board_id`, `list_id`, `title`, `description`,  
    `assignee_id (or multiple later)`, `status (enum)`,  
    `priority (LOW/MEDIUM/HIGH)`, `estimate_hours`, `due_date`,  
    `created_by`, `created_at`, `updated_at`.
- Actions:
  - Create / edit / delete card.
  - Move card between lists (drag-and-drop).
  - Assign / change assignee.
  - Change status, priority, estimate, due date.

---

### 5.4 Task Assignment & Employee Daily View

This is the core “employee daily task monitoring” functionality.

#### 5.4.1 Assignment

- Each card has a primary **assignee** (employee).
- Optionally allow multiple assignees later (many-to-many table).
- Org Admin / Team Lead can assign tasks to employees of that organization.

#### 5.4.2 Daily View (Per Employee)

- For each employee, the system provides a **“Today View”**:
  - All tasks assigned to them that:
    - Are not done, and
    - Have due date ≤ today or are currently in progress.
- Additional filters:
  - Filter by board, team, priority, status.
- Display fields:
  - Task title, board, list name, status, priority, estimate, due date.

#### 5.4.3 Daily Workload Summary

- For a given employee and day (e.g., today):
  - Total number of active tasks.
  - Sum of `estimate_hours` of active tasks.
  - Number of tasks due today.
  - Number of tasks completed today.

---

### 5.5 Comments & Activity Logs

#### 5.5.1 Comments

- Users can comment on cards.
- Fields:
  - `id`, `card_id`, `user_id`, `message`, `created_at`.
- Actions:
  - Add comment.
  - Edit/delete own comment (for a limited time, optional).

#### 5.5.2 Activity Log

- The system logs important actions per card:
  - Card created.
  - Card moved from List A to List B.
  - Assignee changed.
  - Status/priority/due date changed.
- Fields:
  - `id`, `card_id`, `user_id (optional)`, `action_type`, `metadata (jsonb)`, `created_at`.
- Activity logs displayed in a timeline on card detail view.

---

### 5.6 Daily Status Updates & Reports

#### 5.6.1 Employee Daily Check-in

- Each employee can submit a **daily status update**:
  - For a given date (default: today).
  - Fields:
    - `user_id`, `date`, `summary (What I worked on)`, `blockers`, `mood (optional)`.
- A user can have at most one status update per day (update allowed).

#### 5.6.2 Team Daily Overview

- Team Leads can view:
  - For selected date (default: today):
    - List of employees in their team.
    - Each employee’s:
      - Daily status summary (if submitted).
      - Number of tasks:
        - Active
        - Completed today
      - Total estimated workload.
- Org Admin can view this for all teams.

#### 5.6.3 Weekly/Monthly Reports (Basic)

- View simple summaries:
  - Completed tasks per employee per week.
  - Total estimated hours vs completed tasks per employee.
- Export basic CSV/JSON (optional later).

---

### 5.7 Notifications (Basic)

- Simple **in-app notifications**:
  - When a user is assigned to a card.
  - When a card assigned to the user is moved to a different list.
  - When someone comments on a card assigned to the user.
- Fields:
  - `id`, `user_id`, `type`, `payload (jsonb)`, `is_read`, `created_at`.
- UI:
  - Notification bell with unread count.
  - List of notifications.

(Email & push notifications can be future enhancements.)

---

### 5.8 SOAP Integration – Daily Summary Export

Goal: Showcase **SOAP API** integration in a realistic but controlled scope.

#### 5.8.1 Objective

- At the end of each day (or manual trigger), send **daily employee summaries** to an external system using SOAP, for example:
  - Employee ID
  - Date
  - Number of tasks completed
  - Total estimated hours of active tasks
  - Text summary from daily check-in

#### 5.8.2 Behavior

- Org Admin / System Admin can:
  - Configure SOAP endpoint URL and credentials in settings.
  - Trigger “Export Daily Summary” for:
    - Entire organization for a date.
    - A specific team for a date.
- System:
  - Collects required data from DB.
  - For each employee, constructs SOAP payload.
  - Sends to external SOAP service.
  - Logs:
    - Request/response
    - Success/failure status per employee.

#### 5.8.3 Failure Handling

- If SOAP call fails:
  - Record a failed integration log with error message.
  - Allow re-trying for a specific date/team.

---

### 5.9 Admin & Settings

- **Organization Settings**
  - Default work hours per day.
  - Default board templates (To Do, In Progress, Done).
- **Integration Settings**
  - SOAP endpoint configuration.
- **User Management**
  - View users, roles, status.
  - Invite users (placeholder, manual creation for MVP).

---

## 6. Backend Architecture (NestJS + PostgreSQL)

### 6.1 Modules

- `AuthModule`
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
- `ConfigModule` (for environment/config)

### 6.2 API Overview (REST – High Level)

> Not full swagger, just illustrative.

- `POST /auth/register-org`
- `POST /auth/login`
- `GET /me`

- `GET /organizations/:id`
- `PATCH /organizations/:id`

- `POST /teams`
- `GET /teams`
- `GET /teams/:id`
- `PATCH /teams/:id`
- `DELETE /teams/:id`

- `POST /users`
- `GET /users`
- `PATCH /users/:id`
- `DELETE /users/:id`

- `POST /boards`
- `GET /boards`
- `GET /boards/:id`
- `PATCH /boards/:id`
- `DELETE /boards/:id`

- `POST /boards/:boardId/lists`
- `PATCH /lists/:id`
- `PATCH /lists/reorder`

- `POST /boards/:boardId/cards`
- `GET /boards/:boardId/cards`
- `GET /cards/:id`
- `PATCH /cards/:id`
- `PATCH /cards/:id/move`
- `DELETE /cards/:id`

- `POST /cards/:cardId/comments`
- `GET /cards/:cardId/comments`

- `GET /cards/:cardId/activity`

- `POST /daily-status`
- `GET /daily-status?date=YYYY-MM-DD`

- `GET /employee/:id/daily-summary?date=YYYY-MM-DD`
- `GET /team/:id/daily-summary?date=YYYY-MM-DD`

- `GET /reports/weekly?teamId=...`
- `GET /reports/employee/:id?from=...&to=...`

- `GET /notifications`
- `PATCH /notifications/:id/read`

- `POST /integrations/daily-summary/export`  
  (Triggers SOAP export for a given date/team/org.)

---

### 6.3 Data Model (Entities – High Level)

- `User`
- `Organization`
- `Team`
- `TeamMember` (user ↔ team many-to-many)
- `Board`
- `BoardMember` (user ↔ board many-to-many)
- `List`
- `Card`
- `Comment`
- `ActivityLog`
- `DailyStatus`
- `Notification`
- `IntegrationConfig`
- `DailyExportLog` (for SOAP integration results)

(Implementation specifics: PostgreSQL + TypeORM/Prisma.)

---

## 7. Frontend Architecture (Angular + NgRx + Nx)

### 7.1 Nx Structure (Example)

- `apps/`
  - `teamboard-web` (Angular app)
  - `teamboard-api` (NestJS app) – optional if in same monorepo
- `libs/`
  - `libs/shared/types` (TypeScript interfaces/DTOs)
  - `libs/shared/ui` (common UI components: buttons, layout)
  - `libs/shared/state` (global NgRx utilities)
  - `libs/features/auth`
  - `libs/features/boards`
  - `libs/features/daily-view`
  - `libs/features/reports`
  - `libs/core/services` (API services, interceptors)

### 7.2 Angular Feature Areas (Pages/Modules)

- **Auth**
  - Login page
  - (Optional) Org registration page
- **Dashboard**
  - Overview of boards & today’s summary for the logged-in user
- **Boards**
  - Board list page
  - Board detail page (Kanban view: lists & cards)
- **Employee Daily View**
  - “My Day” page (for employee)
  - “Team Daily View” page (for Team Lead)
- **Card Detail**
  - Card detail drawer/modal:
    - Fields
    - Comments
    - Activity log
- **Reports**
  - Weekly/Monthly team report
- **Admin**
  - Organization settings
  - Team management
  - User management
- **Notifications**
  - Notification bell & list

### 7.3 NgRx State Slices (Examples)

- `auth` – user, token, roles, loading, error.
- `boards` – normalized boards, lists, cards.
- `users` – employees directory.
- `dailyView` – summaries per employee/day.
- `notifications` – unread/read notifications.

### 7.4 RxJS Usage

- Use `HttpClient` returning `Observable<T>`.
- Use `switchMap`, `mergeMap`, `catchError`, `debounceTime`, `combineLatest` for:
  - Filtering boards and tasks.
  - Debounced search inputs.
  - Periodic refresh of daily summaries (optional).
- Use `AsyncPipe` extensively in templates.

---

## 8. Security & Permissions

- **JWT auth** on all protected routes.
- **Role-based guards**:
  - Only Org Admin can manage organization-level settings and user roles.
  - Team Leads can see daily summaries of their team only.
  - Employees can only see their own “My Day” view and boards they are members of.
- **Organization boundaries**:
  - Users cannot see data of other organizations.

---

## 9. Non-Functional Requirements

### 9.1 Performance

- Reasonable response time (< 300–500 ms for typical requests).
- Use PostgreSQL indexes on:
  - `organization_id`, `team_id`, `board_id`, `assignee_id`, `due_date`.
- Paginate lists (boards, cards, activity logs).

### 9.2 Reliability

- Basic error handling and meaningful error messages.
- Graceful handling of SOAP integration failures.

### 9.3 Logging & Monitoring

- Backend:
  - Use NestJS logger/Winston:
    - Log errors, SOAP requests/responses, slow queries.
- Health endpoint: `/health` for readiness checks.

### 9.4 Testing

- **Backend:**
  - Unit tests (Jest) for services.
  - E2E tests (Supertest) for key endpoints (auth, boards, cards).
- **Frontend:**
  - Unit tests for components and NgRx reducers/effects.
  - E2E tests (Cypress/Playwright) for main flows (login, board, daily view).

---

## 10. Future Enhancements (Nice-to-Have)

- Real-time updates using WebSockets.
- File attachments for cards.
- Integration with external calendar (Google/Outlook).
- Advanced reports with charts.
- SLA tracking & alerts.
- Comments tagging (@mentions) and rich text.

---

## 11. Summary

TeamBoard is a **Trello-inspired, employee-focused task management system** that:

- Uses **boards/lists/cards** for Kanban-style project management.
- Adds **employee daily monitoring** via per-user daily views, summaries, and reports.
- Includes **SOAP integration** for exporting daily summaries to external systems.
- Exercises **NestJS + PostgreSQL** on the backend and **Angular 17 + NgRx + RxJS + Nx** on the frontend.

This requirement document will act as the blueprint for building your interview-ready, portfolio-worthy project.

