# TeamBoard - Data Flow Diagrams

## Overview

This document illustrates the key data flows and interactions within the TeamBoard application, covering authentication, board management, daily tracking, and SOAP integration.

---

## 1. Authentication Flow

### User Login

```
┌─────────┐
│ Browser │
└────┬────┘
     │
     │ 1. POST /auth/login
     │    { email, password }
     │
     ▼
┌─────────────────┐
│  Angular App    │
│  (Auth Module)  │
└────┬────────────┘
     │
     │ 2. HTTP Request
     │
     ▼
┌────────────────────┐
│  NestJS Backend    │
│  AuthController    │
└────┬───────────────┘
     │
     │ 3. Validate credentials
     │
     ▼
┌────────────────────┐
│   AuthService      │
│  - Find user by email
│  - Compare password (bcrypt)
└────┬───────────────┘
     │
     │ 4. Query user
     │
     ▼
┌────────────────────┐
│   PrismaService    │
│   (Database)       │
└────┬───────────────┘
     │
     │ 5. Return user data
     │
     ▼
┌────────────────────┐
│   AuthService      │
│  - Generate JWT    │
│    (user id, org id, role)
└────┬───────────────┘
     │
     │ 6. Return { token, user }
     │
     ▼
┌────────────────────┐
│  AuthController    │
└────┬───────────────┘
     │
     │ 7. HTTP Response
     │    { token, user }
     │
     ▼
┌─────────────────┐
│  Angular App    │
│  - Store token  │
│  - Update NgRx  │
│    auth state   │
└────┬────────────┘
     │
     │ 8. Navigate to /dashboard
     │
     ▼
┌─────────┐
│Dashboard│
└─────────┘
```

### Authenticated Request Flow

```
┌─────────────────┐
│  Angular App    │
│  (HTTP Client)  │
└────┬────────────┘
     │
     │ 1. GET /boards
     │    Headers: Authorization: Bearer <token>
     │
     ▼
┌────────────────────┐
│  Auth Interceptor  │
│  (Angular)         │
│  - Attach JWT      │
└────┬───────────────┘
     │
     │ 2. HTTP Request with token
     │
     ▼
┌────────────────────┐
│  NestJS Backend    │
│  JWT Guard         │
│  - Verify token    │
│  - Extract user    │
└────┬───────────────┘
     │
     │ 3. If valid, proceed
     │    If invalid, return 401
     │
     ▼
┌────────────────────┐
│  BoardsController  │
│  - Access user from request
│  - Apply RBAC checks
└────┬───────────────┘
     │
     │ 4. Process request
     │
     ▼
┌────────────────────┐
│  BoardsService     │
└────┬───────────────┘
     │
     │ 5. Query boards
     │
     ▼
┌────────────────────┐
│  Database          │
└────┬───────────────┘
     │
     │ 6. Return boards
     │
     ▼
┌────────────────────┐
│  Angular App       │
│  - Update NgRx     │
│    boards state    │
└────────────────────┘
```

---

## 2. Board & Card Management Flow

### Creating a Board

```
User (Team Lead)
     │
     │ 1. Fill "Create Board" form
     │
     ▼
┌─────────────────┐
│  Angular        │
│  BoardComponent │
└────┬────────────┘
     │
     │ 2. Dispatch action:
     │    createBoard({ name, description })
     │
     ▼
┌─────────────────┐
│  NgRx Store     │
│  BoardsActions  │
└────┬────────────┘
     │
     │ 3. Trigger effect
     │
     ▼
┌─────────────────┐
│  BoardsEffects  │
└────┬────────────┘
     │
     │ 4. Call BoardsService.createBoard()
     │
     ▼
┌─────────────────┐
│  BoardsService  │
│  (HTTP Client)  │
└────┬────────────┘
     │
     │ 5. POST /boards
     │    { name, description, teamId }
     │
     ▼
┌────────────────────┐
│  NestJS Backend    │
│  BoardsController  │
└────┬───────────────┘
     │
     │ 6. Validate DTO
     │
     ▼
┌────────────────────┐
│  BoardsService     │
│  - Check permissions
│  - Create board in DB
└────┬───────────────┘
     │
     │ 7. prisma.board.create()
     │
     ▼
┌────────────────────┐
│  PostgreSQL        │
└────┬───────────────┘
     │
     │ 8. Return created board
     │
     ▼
┌─────────────────┐
│  BoardsEffects  │
│  - Dispatch     │
│    success action
└────┬────────────┘
     │
     │ 9. Update state
     │
     ▼
┌─────────────────┐
│  NgRx Store     │
│  - Add board to │
│    entities     │
└────┬────────────┘
     │
     │ 10. UI updates via selector
     │
     ▼
┌─────────────────┐
│  BoardComponent │
│  - Show new     │
│    board in list│
└─────────────────┘
```

---

### Moving a Card (Drag & Drop)

```
User
     │ 1. Drag card from List A to List B
     │
     ▼
┌─────────────────┐
│  Angular CDK    │
│  Drag & Drop    │
└────┬────────────┘
     │ 2. Drop event
     │
     ▼
┌─────────────────┐
│  BoardComponent │
│  - onCardDrop() │
└────┬────────────┘
     │
     │ 3. Dispatch action:
     │    moveCard({ cardId, toListId, position })
     │
     ▼
┌─────────────────┐
│  CardsEffects   │
└────┬────────────┘
     │
     │ 4. PATCH /cards/:id/move
     │    { listId, position }
     │
     ▼
┌────────────────────┐
│  CardsController   │
└────┬───────────────┘
     │
     │ 5. CardsService.moveCard()
     │
     ▼
┌────────────────────┐
│  CardsService      │
│  - Update card.list_id
│  - Log activity    │
└────┬───────────────┘
     │
     │ 6. Transaction:
     │    - Update card
     │    - Create activity log
     │
     ▼
┌────────────────────┐
│  PostgreSQL        │
└────┬───────────────┘
     │
     │ 7. Return updated card
     │
     ▼
┌─────────────────┐
│  NgRx Store     │
│  - Update card  │
│    in state     │
└────┬────────────┘
     │
     │ 8. UI reflects new position
     │
     ▼
┌─────────────────┐
│  BoardComponent │
└─────────────────┘
```

---

## 3. Daily Status & Employee Tracking Flow

### Employee Submits Daily Status

```
Employee
     │ 1. Fill "Daily Check-in" form
     │
     ▼
┌─────────────────┐
│  DailyViewPage  │
└────┬────────────┘
     │
     │ 2. Dispatch:
     │    submitDailyStatus({ date, summary, blockers, mood })
     │
     ▼
┌─────────────────┐
│ DailyEffects    │
└────┬────────────┘
     │
     │ 3. POST /daily-status
     │
     ▼
┌────────────────────┐
│ DailyStatusController │
└────┬───────────────┘
     │
     │ 4. DailyStatusService.create()
     │
     ▼
┌────────────────────┐
│ DailyStatusService │
│ - Check if exists  │
│   for user + date  │
│ - Upsert status    │
└────┬───────────────┘
     │
     │ 5. prisma.dailyStatus.upsert()
     │
     ▼
┌────────────────────┐
│  PostgreSQL        │
└────┬───────────────┘
     │
     │ 6. Return status
     │
     ▼
┌─────────────────┐
│  NgRx Store     │
│  - Update state │
└────┬────────────┘
     │
     │ 7. Show success message
     │
     ▼
┌─────────────────┐
│  DailyViewPage  │
└─────────────────┘
```

---

### Team Lead Views Team Daily Summary

```
Team Lead
     │ 1. Navigate to /daily-view/team
     │
     ▼
┌─────────────────┐
│ TeamDailyView   │
│  Component      │
└────┬────────────┘
     │
     │ 2. Dispatch:
     │    loadTeamDailySummary({ teamId, date })
     │
     ▼
┌─────────────────┐
│ DailyEffects    │
└────┬────────────┘
     │
     │ 3. GET /team/:id/daily-summary?date=2025-01-15
     │
     ▼
┌────────────────────┐
│ ReportsController  │
└────┬───────────────┘
     │
     │ 4. ReportsService.getTeamDailySummary()
     │
     ▼
┌────────────────────┐
│ ReportsService     │
│ - Get team members │
│ - For each member: │
│   - Daily status   │
│   - Active tasks   │
│   - Completed tasks│
└────┬───────────────┘
     │
     │ 5. Multiple queries:
     │    - SELECT FROM team_members
     │    - SELECT FROM daily_statuses
     │    - SELECT FROM cards (aggregates)
     │
     ▼
┌────────────────────┐
│  PostgreSQL        │
└────┬───────────────┘
     │
     │ 6. Return aggregated data
     │    [{ user, status, taskSummary }, ...]
     │
     ▼
┌─────────────────┐
│  NgRx Store     │
└────┬────────────┘
     │
     │ 7. Render table
     │
     ▼
┌─────────────────────────────────┐
│ TeamDailyView Component         │
│ ┌─────────────────────────────┐ │
│ │ User  │ Status │ Tasks │ ... │ │
│ ├───────┼────────┼───────┼─────┤ │
│ │ Alice │ ✓      │ 5/2   │     │ │
│ │ Bob   │ ✗      │ 3/1   │     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## 4. SOAP Integration Flow (Daily Summary Export)

### Manual Trigger by Org Admin

```
Org Admin
     │ 1. Click "Export Daily Summary" button
     │
     ▼
┌─────────────────┐
│ AdminPanel      │
│ Component       │
└────┬────────────┘
     │
     │ 2. Dispatch:
     │    exportDailySummary({ date, teamId? })
     │
     ▼
┌─────────────────┐
│ IntegrationEffects │
└────┬────────────┘
     │
     │ 3. POST /integrations/daily-summary/export
     │    { date, teamId }
     │
     ▼
┌────────────────────┐
│ IntegrationsController │
└────┬───────────────┘
     │
     │ 4. IntegrationsService.exportDailySummary()
     │
     ▼
┌────────────────────┐
│ IntegrationsService│
│ - Get integration  │
│   config (SOAP URL)│
│ - Fetch daily data │
│ - Call SOAPService │
└────┬───────────────┘
     │
     │ 5. Fetch data for each employee
     │
     ▼
┌────────────────────┐
│  Database Queries  │
│ - Daily statuses   │
│ - Task summaries   │
└────┬───────────────┘
     │
     │ 6. For each employee:
     │    SOAPService.sendEmployeeSummary()
     │
     ▼
┌────────────────────┐
│  SOAPService       │
│ - Build SOAP XML   │
│ - HTTP POST        │
└────┬───────────────┘
     │
     │ 7. SOAP Request
     │
     ▼
┌────────────────────┐
│ External SOAP      │
│ Service (HR/Time)  │
└────┬───────────────┘
     │
     │ 8. SOAP Response
     │
     ▼
┌────────────────────┐
│  SOAPService       │
│ - Parse response   │
└────┬───────────────┘
     │
     │ 9. Log result
     │
     ▼
┌────────────────────┐
│  Database          │
│  daily_export_logs │
│  - user_id         │
│  - status: SUCCESS │
│  - response        │
└────┬───────────────┘
     │
     │ 10. Return summary
     │     { success: 10, failed: 0 }
     │
     ▼
┌─────────────────┐
│ AdminPanel      │
│ - Show result   │
└─────────────────┘
```

### SOAP Request Example

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <SubmitEmployeeDailySummary>
      <EmployeeId>123e4567-e89b-12d3-a456-426614174000</EmployeeId>
      <Date>2025-01-15</Date>
      <TasksCompleted>2</TasksCompleted>
      <ActiveTasks>5</ActiveTasks>
      <EstimatedHours>8.5</EstimatedHours>
      <Summary>Worked on login feature and bug fixes</Summary>
      <Blockers>None</Blockers>
    </SubmitEmployeeDailySummary>
  </soapenv:Body>
</soapenv:Envelope>
```

---

## 5. Notification Flow

### User Assigned to Card

```
Team Lead assigns card to Employee
     │
     ▼
┌────────────────────┐
│  CardsService      │
│  - Update assignee │
└────┬───────────────┘
     │
     │ 1. After card update
     │
     ▼
┌────────────────────┐
│  NotificationsService │
│  - Create notification │
└────┬───────────────┘
     │
     │ 2. prisma.notification.create({
     │      userId: assigneeId,
     │      type: 'CARD_ASSIGNED',
     │      payload: { cardId, cardTitle, assignedBy }
     │    })
     │
     ▼
┌────────────────────┐
│  Database          │
└────┬───────────────┘
     │
     │ 3. Employee's next request
     │    GET /notifications
     │
     ▼
┌────────────────────┐
│  NotificationsController │
└────┬───────────────┘
     │
     │ 4. Return unread notifications
     │
     ▼
┌─────────────────┐
│  Angular App    │
│  - Update badge │
│    count        │
└────┬────────────┘
     │
     │ 5. User clicks notification bell
     │
     ▼
┌─────────────────┐
│ Notification    │
│ Dropdown        │
│ "You were       │
│  assigned to    │
│  'Fix bug #42'" │
└─────────────────┘
```

---

## 6. Real-Time Updates (Optional Future Enhancement)

### WebSocket Flow (Future)

```
┌─────────────────┐
│  Angular App    │
│  - Connect to   │
│    WebSocket    │
└────┬────────────┘
     │
     │ ws://api/ws?token=<jwt>
     │
     ▼
┌────────────────────┐
│  NestJS Gateway    │
│  - Validate JWT    │
│  - Store connection│
└────┬───────────────┘
     │
     │ Event: Card moved
     │
     ▼
┌────────────────────┐
│  CardsService      │
│  - Emit event to   │
│    WebSocket       │
└────┬───────────────┘
     │
     │ Broadcast to board room
     │
     ▼
┌─────────────────┐
│  Angular App    │
│  - Receive event│
│  - Update NgRx  │
│    state        │
└────┬────────────┘
     │
     │ UI updates automatically
     │
     ▼
┌─────────────────┐
│  Board View     │
└─────────────────┘
```

---

## 7. Error Handling Flow

```
┌─────────────────┐
│  Angular App    │
└────┬────────────┘
     │
     │ API request fails
     │
     ▼
┌────────────────────┐
│ Error Interceptor  │
│ (Angular)          │
│ - Catch HTTP error │
└────┬───────────────┘
     │
     │ If 401: Redirect to login
     │ If 403: Show "Access Denied"
     │ If 500: Show "Server Error"
     │
     ▼
┌─────────────────┐
│  NgRx Effects   │
│  - Dispatch     │
│    error action │
└────┬────────────┘
     │
     │
     ▼
┌─────────────────┐
│  NgRx State     │
│  - Set error    │
│    message      │
└────┬────────────┘
     │
     │
     ▼
┌─────────────────┐
│  UI Component   │
│  - Show error   │
│    snackbar     │
└─────────────────┘
```

---

## 8. State Management (NgRx) Flow

```
Component
     │
     │ 1. Dispatch action:
     │    loadBoards()
     │
     ▼
┌─────────────────┐
│  NgRx Store     │
└────┬────────────┘
     │
     │ 2. Action sent to reducers & effects
     │
     ├──────────────┬────────────────┐
     │              │                │
     ▼              ▼                ▼
┌─────────┐  ┌──────────┐    ┌─────────┐
│ Reducer │  │ Effects  │    │Selectors│
│ - Set   │  │ - Call   │    │         │
│  loading│  │   API    │    │         │
│  = true │  └──┬───────┘    └─────────┘
└─────────┘     │
                │ 3. API call
                ▼
        ┌───────────────┐
        │ BoardsService │
        └───┬───────────┘
            │
            │ 4. HTTP request
            ▼
        ┌───────────────┐
        │ Backend API   │
        └───┬───────────┘
            │
            │ 5. Response
            ▼
        ┌───────────────┐
        │ Effects       │
        │ - Dispatch    │
        │   success     │
        └───┬───────────┘
            │
            ▼
        ┌───────────────┐
        │ Reducer       │
        │ - Set boards  │
        │ - loading=false│
        └───┬───────────┘
            │
            │ 6. State updated
            ▼
        ┌───────────────┐
        │ Selectors     │
        │ - selectAllBoards │
        └───┬───────────┘
            │
            │ 7. Component subscribes
            ▼
        ┌───────────────┐
        │ Component     │
        │ boards$ =     │
        │  store.select │
        │  (selectAll)  │
        └───┬───────────┘
            │
            │ 8. Render via async pipe
            ▼
        ┌───────────────┐
        │ Template      │
        │ *ngFor boards │
        └───────────────┘
```

---

## Summary

These data flow diagrams illustrate:
- ✅ **Authentication**: JWT-based auth flow
- ✅ **Board/Card Management**: CRUD operations with NgRx state management
- ✅ **Daily Tracking**: Employee check-ins and team summaries
- ✅ **SOAP Integration**: External system data export
- ✅ **Notifications**: User notification creation and delivery
- ✅ **Error Handling**: Graceful error propagation
- ✅ **State Management**: NgRx unidirectional data flow

These flows provide a complete picture of how data moves through the TeamBoard application from user interaction to database and back.
