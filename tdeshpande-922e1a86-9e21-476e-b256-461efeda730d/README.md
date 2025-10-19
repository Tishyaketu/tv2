# Secure Task Management System

A full-stack task management application built with NestJS, Angular, and NX monorepo, featuring robust role-based access control (RBAC) and JWT authentication.

## 🚀 Features

- **JWT Authentication** - Secure login with token-based authentication
- **Role-Based Access Control (RBAC)** - Owner, Admin, and Viewer roles with hierarchical permissions
- **Task Management** - Create, read, update, and delete tasks
- **Organization Hierarchy** - 2-level organization structure (Parent → Child)
- **Drag & Drop** - Reorder tasks with intuitive drag-and-drop interface
- **Filtering & Categorization** - Filter tasks by status and category
- **Audit Logging** - Track all actions for security and compliance
- **Responsive Design** - Mobile-first UI with TailwindCSS
- **Real-time Updates** - Tasks refresh automatically after operations

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Data Model](#data-model)
- [API Documentation](#api-documentation)
- [Access Control](#access-control)
- [Testing](#testing)
- [Future Improvements](#future-improvements)

---

## 🏗 Architecture

### NX Monorepo Structure
```
tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/
├── api/                    # NestJS Backend
│   ├── src/
│   │   ├── entities/       # TypeORM entities
│   │   ├── modules/
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── tasks/      # Task CRUD module
│   │   │   └── audit/      # Audit logging module
│   │   └── main.ts
│
├── apps/
│   └── tdeshpande-.../     # Angular Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/
│       │   │   │   ├── login/
│       │   │   │   ├── dashboard/
│       │   │   │   ├── task-list/
│       │   │   │   └── task-form/
│       │   │   ├── services/
│       │   │   ├── guards/
│       │   │   └── interceptors/
│
├── auth/                   # Shared RBAC Library
│   └── src/
│       └── lib/
│           ├── guards/     # JWT & Roles guards
│           └── decorators/ # Custom decorators
│
└── data/                   # Shared DTOs & Interfaces
    └── src/
        └── lib/
            ├── dtos/       # Data transfer objects
            └── enums/      # Shared enums
```

### Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│                   Angular Frontend                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Login     │  │  Dashboard   │  │ Task List  │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
│         │                  │                │        │
│         └──────────────────┴────────────────┘        │
│                     │                                │
│              ┌──────▼──────┐                         │
│              │ Auth Service │                        │
│              │ HTTP Client  │                        │
│              └──────┬──────┘                         │
└─────────────────────┼────────────────────────────────┘
                      │ JWT Token
                      │ HTTP Requests
┌─────────────────────▼────────────────────────────────┐
│                  NestJS Backend                       │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │    Auth    │  │    Tasks    │  │    Audit     │  │
│  │  Module    │  │   Module    │  │   Module     │  │
│  └─────┬──────┘  └──────┬──────┘  └──────┬───────┘  │
│        │                │                 │          │
│  ┌─────▼────────────────▼─────────────────▼───────┐  │
│  │         JWT Strategy & RBAC Guards             │  │
│  └─────┬──────────────────────────────────────────┘  │
│        │                                              │
│  ┌─────▼──────────────────────────────────────────┐  │
│  │              TypeORM + SQLite                  │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌───────────┐  │  │
│  │  │ User │  │ Task │  │ Org  │  │ AuditLog  │  │  │
│  │  └──────┘  └──────┘  └──────┘  └───────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database operations
- **SQLite** - Lightweight database (easily switchable to PostgreSQL)
- **Passport JWT** - JWT authentication strategy
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

### Frontend
- **Angular 20** - Modern web framework
- **RxJS** - Reactive programming
- **TailwindCSS** - Utility-first CSS framework
- **Angular CDK** - Drag & drop functionality
- **TypeScript** - Type-safe JavaScript

### Monorepo
- **NX** - Smart, fast build system
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v20 or v22 recommended)
- npm (v8+)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd tdeshpande-922e1a86-9e21-476e-b256-461efeda730d
```

2. **Install dependencies**
```bash
npm install
```

3. **Seed the database**
```bash
npm run seed
```

This creates sample data:
- **Owner**: owner@acme.com / password123
- **Admin**: admin@acme.com / password123
- **Viewer**: viewer@acme.com / password123

4. **Start the backend**
```bash
npx nx serve api
```
Backend runs on `http://localhost:3000`

5. **Start the frontend** (in a new terminal)
```bash
npx nx serve tdeshpande-922e1a86-9e21-476e-b256-461efeda730d
```
Frontend runs on `http://localhost:4200`

### Environment Variables

Create `.env` file in the root directory:
```env
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

---

## 📊 Data Model

### Entity Relationship Diagram (ERD)
```
┌─────────────────────┐
│   Organization      │
│─────────────────────│
│ id (PK)             │
│ name                │
│ parentId (FK)       │◄────┐
└──────┬──────────────┘     │
       │ 1                  │
       │                    │ parent
       │                    │
       │ *                  │
┌──────▼──────────────┐     │
│       User          │     │
│─────────────────────│     │
│ id (PK)             │     │
│ email (unique)      │     │
│ password            │     │
│ name                │     │
│ role (enum)         │     │
│ organizationId (FK) ├─────┘
└──────┬──────────────┘
       │ 1
       │
       │ *
┌──────▼──────────────┐
│       Task          │
│─────────────────────│
│ id (PK)             │
│ title               │
│ description         │
│ category (enum)     │
│ status (enum)       │
│ order               │
│ organizationId (FK) │
│ createdById (FK)    │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘

┌─────────────────────┐
│     AuditLog        │
│─────────────────────│
│ id (PK)             │
│ action              │
│ resource            │
│ resourceId          │
│ userId (FK)         │
│ metadata (JSON)     │
│ createdAt           │
└─────────────────────┘
```

### Enums

**UserRole**
- `Owner` - Full access, can delete tasks
- `Admin` - Can create and edit tasks
- `Viewer` - Read-only access

**TaskStatus**
- `pending` - Not started
- `in-progress` - Currently working
- `completed` - Finished

**TaskCategory**
- `Work` - Work-related tasks
- `Personal` - Personal tasks

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All endpoints (except login) require JWT authentication via Bearer token:
```
Authorization: Bearer <token>
```

### Endpoints

#### **POST /auth/login**
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "owner@acme.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "owner@acme.com",
    "name": "John Owner",
    "role": "Owner",
    "organizationId": "uuid"
  }
}
```

---

#### **GET /tasks**
Get all tasks accessible to the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Setup project",
    "description": "Initialize repository",
    "category": "Work",
    "status": "completed",
    "order": 1,
    "organizationId": "uuid",
    "createdById": "uuid",
    "createdAt": "2025-10-19T12:00:00Z",
    "updatedAt": "2025-10-19T12:00:00Z"
  }
]
```

---

#### **POST /tasks**
Create a new task (Admin/Owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "category": "Work",
  "status": "pending"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "New Task",
  "description": "Task description",
  "category": "Work",
  "status": "pending",
  "order": 0,
  "organizationId": "uuid",
  "createdById": "uuid",
  "createdAt": "2025-10-19T12:00:00Z",
  "updatedAt": "2025-10-19T12:00:00Z"
}
```

---

#### **PUT /tasks/:id**
Update an existing task (Admin/Owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "in-progress",
  "order": 2
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "New Task",
  "status": "in-progress",
  "order": 2,
  ...
}
```

---

#### **DELETE /tasks/:id**
Delete a task (Owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```
204 No Content
```

---

## 🔐 Access Control Implementation

### Role Hierarchy
```
Owner (Level 3)
  ↓ inherits all permissions
Admin (Level 2)
  ↓ inherits all permissions
Viewer (Level 1)
```

### Permission Matrix

| Action | Viewer | Admin | Owner |
|--------|--------|-------|-------|
| View Tasks (own org) | ✅ | ✅ | ✅ |
| View Tasks (all org) | ❌ | ✅ | ✅ |
| Create Task | ❌ | ✅ | ✅ |
| Update Task | ❌ | ✅ | ✅ |
| Delete Task | ❌ | ❌ | ✅ |
| View Audit Logs | ❌ | ✅ | ✅ |

### Implementation Details

**Backend Guards:**
1. `JwtAuthGuard` - Validates JWT token
2. `RolesGuard` - Checks user role permissions

**Decorators:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.OWNER)
@Post()
async createTask(@Body() dto: CreateTaskDto) {
  // Only Admin and Owner can access
}
```

**Frontend Guards:**
```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

### Organization Scoping

- Tasks are automatically scoped to user's organization
- Viewers can only see tasks from their own organization
- Admins/Owners can see tasks from all child organizations

---

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
npx nx test api

# Frontend tests
npx nx test tdeshpande-922e1a86-9e21-476e-b256-461efeda730d

# Shared library tests
npx nx test auth
npx nx test data
```

### Test Coverage

**Backend:**
- ✅ Authentication service (login, JWT)
- ✅ RBAC guards (role hierarchy)
- ✅ Task CRUD operations
- ✅ Access control enforcement

**Frontend:**
- ✅ Auth service (login, logout, token management)
- ✅ Login component (form validation, error handling)
- ✅ HTTP interceptor (JWT attachment)
- ✅ Auth guard (route protection)

---

## 🚀 Future Improvements

### Production-Ready Security
- [ ] JWT refresh tokens
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] Helmet.js security headers
- [ ] HTTPS enforcement

### Advanced Features
- [ ] Role delegation (dynamic role assignment)
- [ ] Advanced search and filtering
- [ ] Task comments and attachments
- [ ] Email notifications
- [ ] Task templates
- [ ] Bulk operations
- [ ] Export tasks (CSV/PDF)

### Performance Optimization
- [ ] Database indexing
- [ ] Caching layer (Redis)
- [ ] Pagination for large datasets
- [ ] Lazy loading
- [ ] GraphQL API option

### DevOps
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Database migrations
- [ ] Environment-based configs
- [ ] Monitoring and logging (ELK stack)
- [ ] Load testing

### UI/UX Enhancements
- [ ] Dark/light mode toggle
- [ ] Task completion charts
- [ ] Keyboard shortcuts
- [ ] Undo/redo functionality
- [ ] Mobile app (React Native/Ionic)

---

## 📝 License

This project is for assessment purposes.

---

## 👥 Contributors

- Tishya Deshpande

---

## 📞 Support

For issues or questions, please create an issue in the repository.
