# TeamBoard

**Collaborative Task & Employee Daily Tracking Application**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-E0234E.svg)](https://nestjs.com/)
[![Angular](https://img.shields.io/badge/Angular-17+-DD0031.svg)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)
[![Nx](https://img.shields.io/badge/Nx-18+-143055.svg)](https://nx.dev/)

---

## 📋 Overview

**TeamBoard** is a modern, cloud-native task management application that combines **Kanban-style project boards** with **employee daily tracking** capabilities. It's designed to help teams organize work, track progress, and monitor daily workloads efficiently.

### Key Features

- 🎯 **Kanban Boards**: Trello-style boards, lists, and cards for visual task management
- 👥 **Employee Tracking**: Daily check-ins, workload monitoring, and team summaries
- 📊 **Reports & Analytics**: Weekly/monthly reports for team leads and managers
- 🔐 **Role-Based Access Control**: Org Admin, Team Lead, and Employee roles
- 🔌 **SOAP Integration**: Export daily summaries to external HR/timesheet systems
- 🔔 **Notifications**: Real-time in-app notifications for task assignments and updates
- 📱 **Responsive Design**: Angular Material UI with modern, intuitive UX

---

## 🏗️ Architecture

### Technology Stack

**Backend**
- **Framework**: NestJS 10+ (Node.js + TypeScript)
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Authentication**: JWT + bcrypt
- **API**: RESTful + Swagger documentation
- **Testing**: Jest + Supertest

**Frontend**
- **Framework**: Angular 17+ (standalone components)
- **State Management**: NgRx 17+
- **UI Library**: Angular Material
- **Drag & Drop**: Angular CDK
- **Reactive Programming**: RxJS

**Infrastructure**
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (automated testing, building, deployment)
- **Deployment**: Cloud-ready (AWS/Azure/GCP/Render)
- **Testing**: Jest, Jasmine, Karma, Supertest

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         Angular Frontend (Web)          │
│    NgRx State | Angular Material        │
└──────────────┬──────────────────────────┘
               │ REST API (HTTPS)
┌──────────────▼──────────────────────────┐
│         NestJS Backend (API)            │
│  Auth | Boards | Reports | Integration  │
└──────────────┬──────────────────────────┘
               │ Prisma ORM
┌──────────────▼──────────────────────────┐
│       PostgreSQL Database               │
│  Relational Schema | Indexes | Backups  │
└─────────────────────────────────────────┘
```

For detailed architecture diagrams, see:
- [Architecture Plan](docs/Architecture_Plan.md)
- [Database Schema](docs/Database_Schema.md)
- [Data Flow Diagrams](docs/Data_Flow_Diagrams.md)
- [Implementation Roadmap](docs/Implementation_Roadmap.md)

---

## 📂 Project Structure

```
team-board/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── auth/               # Authentication module
│   │   ├── users/              # User management
│   │   ├── organizations/      # Organization management
│   │   ├── teams/              # Team management
│   │   ├── boards/             # Board CRUD
│   │   ├── lists/              # List management
│   │   ├── cards/              # Card/task management
│   │   ├── comments/           # Card comments
│   │   ├── daily-status/       # Daily check-ins
│   │   ├── reports/            # Reports & analytics
│   │   ├── notifications/      # Notification system
│   │   ├── integrations/       # SOAP integration
│   │   ├── activity-log/       # Activity tracking
│   │   ├── prisma/             # Prisma service
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # DB migrations
│   ├── test/                   # E2E tests
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Core services, guards, interceptors
│   │   │   ├── shared/         # Shared models and utilities
│   │   │   └── features/       # Feature modules
│   │   │       ├── auth/       # Login, auth store (NgRx)
│   │   │       ├── dashboard/  # Dashboard with stats
│   │   │       ├── boards/     # Board list & Kanban view
│   │   │       ├── daily-view/ # Daily tracking
│   │   │       ├── reports/    # Reports
│   │   │       └── admin/      # Admin panel
│   │   └── main.ts
│   ├── Dockerfile
│   ├── nginx.conf              # Nginx configuration
│   ├── karma.conf.js           # Test configuration
│   └── package.json
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│       ├── ci-cd.yml           # Main CI/CD workflow
│       └── codeql.yml          # Security scanning
│
├── docs/                       # Documentation
│   ├── TeamBoard Functional Requirements.md
│   ├── Architecture_Plan.md
│   ├── Database_Schema.md
│   ├── Data_Flow_Diagrams.md
│   └── Implementation_Roadmap.md
│
├── docker-compose.yml          # Docker orchestration
├── .env.example                # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 20.x LTS or higher
- **npm**: 10.x or higher
- **Docker**: 24.x or higher (for PostgreSQL)
- **Git**: 2.x or higher

### Installation

#### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayeed007/team-board.git
   cd team-board
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (optional - has defaults)
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:3000
   - **Swagger Docs**: http://localhost:3000/api
   - **PostgreSQL**: localhost:5432

#### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayeed007/team-board.git
   cd team-board
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd ..
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d postgres
   ```

6. **Run database migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

7. **Start the development servers**

   **Terminal 1: Backend**
   ```bash
   cd backend
   npm run start:dev
   ```

   **Terminal 2: Frontend**
   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**
   - **Frontend**: http://localhost:4200
   - **Backend API**: http://localhost:3000
   - **Swagger Docs**: http://localhost:3000/api

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Frontend Tests
```bash
cd frontend

# Run all unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in headless mode
npm test -- --watch=false --browsers=ChromeHeadless
```

### Run Tests in Docker
```bash
# Backend tests
docker-compose run backend npm test

# Frontend tests
docker-compose run frontend npm test -- --watch=false --browsers=ChromeHeadless
```

---

## 🏗️ Building for Production

### Build Backend
```bash
cd backend
npm run build
```

### Build Frontend
```bash
cd frontend
npm run build:prod
```

### Docker Build
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build and start
docker-compose up --build -d
```

---

## 🔧 Development

### Code Generation

**Backend (NestJS)**
```bash
cd backend

# Generate module
nest g module my-module

# Generate controller
nest g controller my-controller

# Generate service
nest g service my-service
```

**Frontend (Angular)**
```bash
cd frontend

# Generate component
ng g component features/my-feature

# Generate service
ng g service core/services/my-service

# Generate guard
ng g guard core/guards/my-guard
```

### Linting

**Backend**
```bash
cd backend
npm run lint
npm run lint -- --fix
```

**Frontend**
```bash
cd frontend
npm run lint
```

### Formatting

**Backend**
```bash
cd backend
npm run format
```

**Frontend**
```bash
cd frontend
npm run format
```

---

## 📚 Documentation

- **[Functional Requirements](docs/TeamBoard%20Functional%20Requirements.md)** - Complete feature specifications
- **[Architecture Plan](docs/Architecture_Plan.md)** - System design and cloud architecture
- **[Database Schema](docs/Database_Schema.md)** - PostgreSQL schema and migrations
- **[Data Flow Diagrams](docs/Data_Flow_Diagrams.md)** - Request/response flows
- **[Implementation Roadmap](docs/Implementation_Roadmap.md)** - Development phases and progress
- **[API Documentation](http://localhost:3000/api)** - Swagger UI (when running locally)

---

## 🔐 Security

- **Authentication**: JWT-based with bcrypt password hashing
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: DTOs with class-validator
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: Angular's built-in sanitization
- **HTTPS**: SSL/TLS in production
- **CORS**: Configured for frontend domain only

---

## 📊 Key Features

### 1. Kanban Boards
- Create unlimited boards for projects/sprints
- Organize work with lists (columns) and cards (tasks)
- Drag-and-drop interface for easy task management
- Assign tasks to team members
- Set priorities, due dates, and estimates

### 2. Employee Daily Tracking
- Daily check-in system for employees
- Track active tasks, completed work, and blockers
- Team lead dashboard for monitoring team workload
- Weekly and monthly reports

### 3. Role-Based Access
- **Org Admin**: Manage organization, users, and teams
- **Team Lead**: Create boards, assign tasks, view team reports
- **Employee**: View assigned tasks, update status, submit daily check-ins

### 4. SOAP Integration
- Export daily employee summaries to external systems
- Configurable SOAP endpoint and credentials
- Detailed export logs with success/failure tracking

### 5. Notifications
- In-app notifications for task assignments
- Alerts for card movements and comments
- Unread notification badge

---

## 🌐 Deployment

### Cloud Deployment Options

**Backend**
- AWS ECS/Fargate
- Render
- Railway
- Heroku

**Frontend**
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

**Database**
- AWS RDS (PostgreSQL)
- Neon (serverless PostgreSQL)
- Supabase
- Azure Database for PostgreSQL

### Environment Variables

Create a `.env` file (see `.env.example` for all variables):

```env
# Backend
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/teamboard
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h

# SOAP Integration
SOAP_ENDPOINT_URL=https://external-service.com/soap
SOAP_USERNAME=your-username
SOAP_PASSWORD=your-password

# Frontend
VITE_API_URL=https://api.teamboard.com
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Sayeed** - [GitHub](https://github.com/sayeed007)

---

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- UI powered by [Angular Material](https://material.angular.io/)
- Monorepo managed by [Nx](https://nx.dev/)
- Database with [Prisma](https://www.prisma.io/)

---

## 📞 Support

For issues and questions:
- Open an [issue](https://github.com/sayeed007/team-board/issues)
- Check the [documentation](docs/)
- Review [functional requirements](docs/TeamBoard%20Functional%20Requirements.md)

---

## 🗺️ Roadmap

### Phase 1 (Current - MVP)
- ✅ Core Kanban functionality
- ✅ Employee daily tracking
- ✅ SOAP integration
- ✅ Basic notifications

### Phase 2 (Planned)
- [ ] WebSocket real-time updates
- [ ] File attachments for cards
- [ ] Advanced reporting with charts
- [ ] Email notifications

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Slack/Teams integration
- [ ] Calendar sync (Google/Outlook)
- [ ] AI-powered task estimation

---

**Built with ❤️ using modern web technologies**
