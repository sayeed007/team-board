# TeamBoard Backend API

NestJS-based REST API for TeamBoard application.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15+ (or Docker)
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp ../.env.example ../.env
# Edit .env with your configuration

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### Development

```bash
# Start development server
npm run start:dev

# The API will be available at:
# - API: http://localhost:3000/api
# - Swagger Docs: http://localhost:3000/api/docs
# - Health Check: http://localhost:3000/api/health
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs

### Demo Credentials (after seeding)

```
Admin:     admin@acme.com / password123
Team Lead: lead@acme.com / password123
Employee:  alice@acme.com / password123
Employee:  bob@acme.com / password123
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication (JWT)
│   ├── users/             # User management
│   ├── organizations/     # Organization management
│   ├── teams/             # Team management
│   ├── boards/            # Board management
│   ├── lists/             # List management
│   ├── cards/             # Card/Task management
│   ├── comments/          # Comments
│   ├── activity-log/      # Activity tracking
│   ├── daily-status/      # Daily status updates
│   ├── reports/           # Reports & analytics
│   ├── notifications/     # Notifications
│   ├── integrations/      # SOAP integration
│   ├── prisma/            # Database service
│   ├── health/            # Health check
│   ├── common/            # Shared utilities
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed data
└── test/                  # E2E tests
```

## 🗄️ Database

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run start:prod` | Start production server |
| `npm run build` | Build for production |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |

## 📦 Main Dependencies

- **NestJS**: Framework
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **Passport**: Authentication
- **JWT**: Token-based auth
- **bcrypt**: Password hashing
- **Swagger**: API documentation
- **class-validator**: DTO validation
- **SOAP**: External integration

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Boards
- `GET /api/boards` - List boards
- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get board
- `PATCH /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Archive board

### Cards
- `GET /api/boards/:id/cards` - List cards
- `POST /api/boards/:id/cards` - Create card
- `GET /api/cards/:id` - Get card
- `PATCH /api/cards/:id` - Update card
- `PATCH /api/cards/:id/move` - Move card
- `DELETE /api/cards/:id` - Delete card

### Daily Status
- `POST /api/daily-status` - Submit daily status
- `GET /api/daily-status` - Get daily statuses
- `GET /api/employee/:id/daily-summary` - Employee summary
- `GET /api/team/:id/daily-summary` - Team summary

### Reports
- `GET /api/reports/weekly` - Weekly report
- `GET /api/reports/employee/:id` - Employee report

### Integrations
- `POST /api/integrations/daily-summary/export` - Export daily summary

*See Swagger documentation for complete API reference*

## 🔒 Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/teamboard

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# CORS
CORS_ORIGIN=http://localhost:4200

# SOAP Integration
SOAP_ENDPOINT_URL=https://external-service.com/soap
SOAP_USERNAME=username
SOAP_PASSWORD=password
```

## 🚢 Deployment

### Build

```bash
npm run build
```

### Production

```bash
NODE_ENV=production npm run start:prod
```

### Docker

```bash
docker build -t teamboard-api .
docker run -p 3000:3000 teamboard-api
```

## 📝 License

MIT
