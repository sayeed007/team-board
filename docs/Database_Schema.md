# TeamBoard - Database Schema Design

## Overview

This document defines the complete PostgreSQL database schema for TeamBoard, including all entities, relationships, indexes, and constraints.

**ORM**: Prisma (recommended) or TypeORM
**Database**: PostgreSQL 15+

---

## 1. Entity Relationship Diagram (Text Format)

```
┌─────────────────┐
│  Organization   │
│─────────────────│
│ id (PK)         │
│ name            │
│ settings (JSON) │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        ├──────────────────────────────────┐
        │                                  │
        ▼                                  ▼
┌─────────────────┐              ┌─────────────────┐
│      User       │              │      Team       │
│─────────────────│              │─────────────────│
│ id (PK)         │              │ id (PK)         │
│ organization_id │◄─────┐       │ organization_id │
│ email (UNIQUE)  │      │       │ name            │
│ password_hash   │      │       │ description     │
│ name            │      │       │ created_at      │
│ role (ENUM)     │      │       │ updated_at      │
│ position        │      │       └─────────────────┘
│ avatar_url      │      │               │
│ status (ENUM)   │      │               │ M:N
│ created_at      │      │               ▼
│ updated_at      │      │       ┌─────────────────┐
│ deleted_at      │      │       │   TeamMember    │
└─────────────────┘      │       │─────────────────│
        │                │       │ id (PK)         │
        │ 1:N            │       │ team_id (FK)    │
        ▼                │       │ user_id (FK)    │
┌─────────────────┐      │       │ joined_at       │
│  DailyStatus    │      │       └─────────────────┘
│─────────────────│      │
│ id (PK)         │      │
│ user_id (FK)    │      │
│ date (UNIQUE)   │      │       ┌─────────────────┐
│ summary         │      │       │     Board       │
│ blockers        │      │       │─────────────────│
│ mood (ENUM)     │      │       │ id (PK)         │
│ created_at      │      │       │ organization_id │
│ updated_at      │      │       │ team_id (FK)    │
└─────────────────┘      │       │ name            │
                         │       │ description     │
        ┌────────────────┘       │ created_by (FK) │
        │                        │ is_archived     │
        │ 1:N                    │ created_at      │
        ▼                        │ updated_at      │
┌─────────────────┐              └─────────────────┘
│  Notification   │                      │
│─────────────────│                      │ M:N
│ id (PK)         │                      ▼
│ user_id (FK)    │              ┌─────────────────┐
│ type (ENUM)     │              │  BoardMember    │
│ payload (JSON)  │              │─────────────────│
│ is_read         │              │ id (PK)         │
│ created_at      │              │ board_id (FK)   │
└─────────────────┘              │ user_id (FK)    │
                                 │ role (ENUM)     │
                                 │ added_at        │
                                 └─────────────────┘
                                         │
                                         │ 1:N
                                         ▼
                                 ┌─────────────────┐
                                 │      List       │
                                 │─────────────────│
                                 │ id (PK)         │
                                 │ board_id (FK)   │
                                 │ name            │
                                 │ position (INT)  │
                                 │ created_at      │
                                 │ updated_at      │
                                 └─────────────────┘
                                         │
                                         │ 1:N
                                         ▼
                                 ┌─────────────────┐
                                 │      Card       │
                                 │─────────────────│
                                 │ id (PK)         │
                                 │ board_id (FK)   │
                                 │ list_id (FK)    │
                                 │ title           │
                                 │ description     │
                                 │ assignee_id (FK)│
                                 │ status (ENUM)   │
                                 │ priority (ENUM) │
                                 │ estimate_hours  │
                                 │ due_date        │
                                 │ position (INT)  │
                                 │ created_by (FK) │
                                 │ created_at      │
                                 │ updated_at      │
                                 │ deleted_at      │
                                 └─────────────────┘
                                         │
                        ┌────────────────┼────────────────┐
                        │                │                │
                        │ 1:N            │ 1:N            │ 1:N
                        ▼                ▼                ▼
                ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
                │   Comment   │  │ ActivityLog │  │CardAttachment│
                │─────────────│  │─────────────│  │─────────────│
                │ id (PK)     │  │ id (PK)     │  │ id (PK)     │
                │ card_id (FK)│  │ card_id (FK)│  │ card_id (FK)│
                │ user_id (FK)│  │ user_id (FK)│  │ filename    │
                │ message     │  │ action_type │  │ url         │
                │ created_at  │  │ metadata    │  │ uploaded_by │
                │ updated_at  │  │ created_at  │  │ created_at  │
                └─────────────┘  └─────────────┘  └─────────────┘


┌────────────────────┐
│ IntegrationConfig  │
│────────────────────│
│ id (PK)            │
│ organization_id    │
│ type (ENUM)        │
│ endpoint_url       │
│ credentials (JSON) │
│ is_active          │
│ created_at         │
│ updated_at         │
└────────────────────┘

┌────────────────────┐
│  DailyExportLog    │
│────────────────────│
│ id (PK)            │
│ organization_id    │
│ date               │
│ user_id (FK)       │
│ status (ENUM)      │
│ request_payload    │
│ response           │
│ error_message      │
│ created_at         │
└────────────────────┘
```

---

## 2. Table Definitions

### 2.1 Organization

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_organizations_name ON organizations(name);
```

**Fields**:
- `id`: Unique identifier
- `name`: Organization name
- `settings`: Flexible JSON for org-level settings (e.g., default work hours, themes)
- `created_at`, `updated_at`: Audit fields

---

### 2.2 User

```sql
CREATE TYPE user_role AS ENUM ('ORG_ADMIN', 'TEAM_LEAD', 'EMPLOYEE', 'SYS_ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'EMPLOYEE',
  position VARCHAR(255),
  avatar_url VARCHAR(512),
  status user_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

**Key Points**:
- `password_hash`: Bcrypt hashed password
- `role`: RBAC role
- `deleted_at`: Soft delete timestamp

---

### 2.3 Team

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teams_organization_id ON teams(organization_id);
```

---

### 2.4 TeamMember (Many-to-Many: Team ↔ User)

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
```

---

### 2.5 Board

```sql
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_boards_organization_id ON boards(organization_id);
CREATE INDEX idx_boards_team_id ON boards(team_id);
CREATE INDEX idx_boards_created_by ON boards(created_by);
CREATE INDEX idx_boards_is_archived ON boards(is_archived);
```

---

### 2.6 BoardMember (Many-to-Many: Board ↔ User)

```sql
CREATE TYPE board_member_role AS ENUM ('OWNER', 'MEMBER', 'VIEWER');

CREATE TABLE board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role board_member_role NOT NULL DEFAULT 'MEMBER',
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(board_id, user_id)
);

CREATE INDEX idx_board_members_board_id ON board_members(board_id);
CREATE INDEX idx_board_members_user_id ON board_members(user_id);
```

---

### 2.7 List

```sql
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_lists_board_position ON lists(board_id, position);
```

**Key Points**:
- `position`: For ordering lists (drag-and-drop)

---

### 2.8 Card

```sql
CREATE TYPE card_status AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');
CREATE TYPE card_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status card_status NOT NULL DEFAULT 'TODO',
  priority card_priority NOT NULL DEFAULT 'MEDIUM',
  estimate_hours DECIMAL(5, 2),
  due_date DATE,
  position INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_cards_board_id ON cards(board_id);
CREATE INDEX idx_cards_list_id ON cards(list_id);
CREATE INDEX idx_cards_assignee_id ON cards(assignee_id);
CREATE INDEX idx_cards_due_date ON cards(due_date);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_cards_priority ON cards(priority);
CREATE INDEX idx_cards_list_position ON cards(list_id, position);
```

**Important Indexes**:
- `assignee_id`: For "My Tasks" queries
- `due_date`: For "Tasks Due Today" queries
- `list_id + position`: For ordering cards in a list

---

### 2.9 Comment

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_card_id ON comments(card_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

---

### 2.10 ActivityLog

```sql
CREATE TYPE activity_action AS ENUM (
  'CARD_CREATED',
  'CARD_UPDATED',
  'CARD_MOVED',
  'CARD_ASSIGNED',
  'CARD_DELETED',
  'COMMENT_ADDED',
  'STATUS_CHANGED',
  'PRIORITY_CHANGED'
);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type activity_action NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_card_id ON activity_logs(card_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

**Metadata Examples**:
```json
{
  "from_list_id": "uuid",
  "to_list_id": "uuid",
  "old_status": "TODO",
  "new_status": "DONE"
}
```

---

### 2.11 DailyStatus

```sql
CREATE TYPE mood AS ENUM ('HAPPY', 'NEUTRAL', 'STRESSED', 'BLOCKED');

CREATE TABLE daily_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  summary TEXT NOT NULL,
  blockers TEXT,
  mood mood,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_statuses_user_id ON daily_statuses(user_id);
CREATE INDEX idx_daily_statuses_date ON daily_statuses(date);
CREATE INDEX idx_daily_statuses_user_date ON daily_statuses(user_id, date);
```

**Constraint**: One status per user per day

---

### 2.12 Notification

```sql
CREATE TYPE notification_type AS ENUM (
  'CARD_ASSIGNED',
  'CARD_MOVED',
  'COMMENT_ADDED',
  'CARD_DUE_SOON',
  'MENTION'
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  payload JSONB NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

**Payload Example**:
```json
{
  "card_id": "uuid",
  "card_title": "Fix login bug",
  "assignedBy": "John Doe"
}
```

---

### 2.13 IntegrationConfig

```sql
CREATE TYPE integration_type AS ENUM ('SOAP', 'REST', 'WEBHOOK');

CREATE TABLE integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type integration_type NOT NULL,
  endpoint_url VARCHAR(512) NOT NULL,
  credentials JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_integration_configs_organization_id ON integration_configs(organization_id);
```

---

### 2.14 DailyExportLog

```sql
CREATE TYPE export_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

CREATE TABLE daily_export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status export_status NOT NULL DEFAULT 'PENDING',
  request_payload JSONB,
  response TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_daily_export_logs_organization_id ON daily_export_logs(organization_id);
CREATE INDEX idx_daily_export_logs_date ON daily_export_logs(date);
CREATE INDEX idx_daily_export_logs_status ON daily_export_logs(status);
```

---

### 2.15 CardAttachment (Optional - Future Enhancement)

```sql
CREATE TABLE card_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(512) NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_card_attachments_card_id ON card_attachments(card_id);
```

---

## 3. Prisma Schema (Example)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Organization {
  id        String   @id @default(uuid())
  name      String
  settings  Json     @default("{}")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  users             User[]
  teams             Team[]
  boards            Board[]
  integrationConfigs IntegrationConfig[]
  dailyExportLogs   DailyExportLog[]

  @@map("organizations")
}

enum UserRole {
  ORG_ADMIN
  TEAM_LEAD
  EMPLOYEE
  SYS_ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

model User {
  id             String      @id @default(uuid())
  organizationId String      @map("organization_id")
  email          String      @unique
  passwordHash   String      @map("password_hash")
  name           String
  role           UserRole    @default(EMPLOYEE)
  position       String?
  avatarUrl      String?     @map("avatar_url")
  status         UserStatus  @default(ACTIVE)
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")
  deletedAt      DateTime?   @map("deleted_at")

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  teamMembers    TeamMember[]
  boardMembers   BoardMember[]
  assignedCards  Card[]       @relation("AssignedCards")
  createdBoards  Board[]      @relation("CreatedBoards")
  createdCards   Card[]       @relation("CreatedCards")
  comments       Comment[]
  activityLogs   ActivityLog[]
  dailyStatuses  DailyStatus[]
  notifications  Notification[]

  @@index([organizationId])
  @@index([email])
  @@index([role])
  @@map("users")
}

// ... (continue for all models)
```

---

## 4. Key Queries & Indexes

### 4.1 Frequent Queries

**Query 1**: Get all tasks for a user due today
```sql
SELECT * FROM cards
WHERE assignee_id = :userId
  AND due_date = CURRENT_DATE
  AND status != 'DONE'
  AND deleted_at IS NULL;
```
**Index**: `idx_cards_assignee_id`, `idx_cards_due_date`

---

**Query 2**: Get all boards for an organization
```sql
SELECT * FROM boards
WHERE organization_id = :orgId
  AND is_archived = FALSE
ORDER BY created_at DESC;
```
**Index**: `idx_boards_organization_id`, `idx_boards_is_archived`

---

**Query 3**: Get daily summary for a user
```sql
SELECT
  COUNT(*) FILTER (WHERE status != 'DONE') as active_tasks,
  SUM(estimate_hours) as total_hours,
  COUNT(*) FILTER (WHERE due_date = CURRENT_DATE) as due_today
FROM cards
WHERE assignee_id = :userId
  AND deleted_at IS NULL;
```

---

## 5. Database Migrations Strategy

- **Tool**: Prisma Migrate or TypeORM Migrations
- **Naming**: `YYYYMMDDHHMMSS_description.sql`
- **Process**:
  1. Generate migration: `npx prisma migrate dev --name add_cards_table`
  2. Review migration file
  3. Apply: `npx prisma migrate deploy` (production)

---

## 6. Seeding Data (Development)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create organization
  const org = await prisma.organization.create({
    data: { name: 'Acme Corp' },
  });

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      email: 'admin@acme.com',
      passwordHash: await hash('password123'),
      name: 'Admin User',
      role: 'ORG_ADMIN',
    },
  });

  // Create team
  const team = await prisma.team.create({
    data: {
      organizationId: org.id,
      name: 'Engineering',
    },
  });

  // ... more seed data
}

main();
```

---

## Summary

This database schema provides:
- ✅ Complete relational integrity
- ✅ Optimized indexes for common queries
- ✅ Soft deletes for audit trails
- ✅ Flexible JSON fields for extensibility
- ✅ Audit timestamps on all tables
- ✅ Proper foreign key constraints
- ✅ ENUM types for type safety

The schema is production-ready and optimized for the TeamBoard application requirements.
