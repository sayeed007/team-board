# TeamBoard Frontend

Angular-based frontend application for TeamBoard.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- Backend API running (see backend/README.md)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start

# The app will be available at:
# http://localhost:4200
```

The development server includes a proxy configuration that forwards API requests to `http://localhost:3000`.

## 🏗️ Project Structure

```
frontend/src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── guards/
│   │   └── auth.guard.ts   # Route protection
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # Add JWT to requests
│   │   └── error.interceptor.ts   # Global error handling
│   └── services/
│       └── auth.service.ts        # Auth utilities
│
├── shared/                  # Reusable components, pipes, directives
│   ├── components/
│   ├── models/             # TypeScript interfaces
│   └── pipes/
│
├── features/               # Feature modules (lazy-loaded)
│   ├── auth/              # Login, registration
│   ├── dashboard/         # Main dashboard
│   ├── boards/            # Kanban boards
│   ├── daily-view/        # Daily task views
│   ├── reports/           # Reports & analytics
│   ├── admin/             # Admin panel
│   └── notifications/     # Notifications
│
├── layout/                # Layout components
│   ├── header/
│   ├── sidebar/
│   └── footer/
│
├── app.component.ts       # Root component
├── app.config.ts          # App configuration
└── app.routes.ts          # Route definitions
```

## 🎨 Features

- **Angular 17+** with standalone components
- **NgRx** for state management
- **Angular Material** for UI components
- **Lazy loading** for optimal performance
- **Reactive forms** with validation
- **RxJS** for reactive programming
- **TypeScript** with strict mode

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run build:prod` | Production build with optimizations |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in headless mode
npm test -- --browsers=ChromeHeadless --watch=false
```

## 🏗️ Building for Production

```bash
# Build production bundle
npm run build:prod

# Output will be in dist/ directory
```

## 🌐 Environment Configuration

### Development (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'TeamBoard',
  version: '1.0.0',
};
```

### Production (`src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: '/api', // Or your production API URL
  appName: 'TeamBoard',
  version: '1.0.0',
};
```

## 🎯 Key Pages

### Authentication
- `/auth/login` - User login
- `/auth/register` - User registration (optional)

### Main App (Requires authentication)
- `/dashboard` - Main dashboard
- `/boards` - Board list
- `/boards/:id` - Board detail (Kanban view)
- `/daily-view/my-day` - Employee daily view
- `/daily-view/team` - Team daily overview
- `/reports` - Reports & analytics
- `/admin` - Admin panel

## 🔧 Development Tools

### VS Code Extensions (Recommended)

- Angular Language Service
- ESLint
- Prettier
- Material Icon Theme

### Browser DevTools

- Install Redux DevTools extension for NgRx state debugging

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 Theming

The app uses Angular Material's theming system. To customize:

1. Edit `src/styles.scss`
2. Define custom theme colors
3. Apply theme to Material components

## 🚀 Deployment

### Vercel/Netlify

```bash
# Build
npm run build:prod

# Deploy dist/ folder
```

### AWS S3 + CloudFront

```bash
# Build
npm run build:prod

# Upload dist/ to S3
aws s3 sync dist/teamboard-frontend s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Docker

```bash
# Build Docker image
docker build -t teamboard-frontend .

# Run container
docker run -p 80:80 teamboard-frontend
```

## 📝 Code Style

- **Components**: Use standalone components (Angular 17+)
- **Services**: Use `providedIn: 'root'` for singleton services
- **State**: Use NgRx for complex state management
- **Naming**: Use kebab-case for files, PascalCase for classes
- **Imports**: Use path aliases (`@core/`, `@shared/`, etc.)

## 🔒 Security

- **XSS Protection**: Angular's built-in sanitization
- **CSRF**: Handled by backend
- **JWT Storage**: localStorage (consider httpOnly cookies for production)
- **Route Guards**: Protect authenticated routes

## 📚 Learn More

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [NgRx Documentation](https://ngrx.io/)
- [RxJS Documentation](https://rxjs.dev/)

## 📝 License

MIT
