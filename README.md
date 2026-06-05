# RemoteJob - Backend API

Enterprise-grade backend for AloraBridge remote workforce platform.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

### 3. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (Admin/HR only)
- `PUT /api/jobs/:id` - Update job (Admin/HR only)
- `DELETE /api/jobs/:id` - Delete job (Admin/HR only)

### Applications
- `GET /api/applications` - List all applications (Admin/HR only)
- `GET /api/applications/my` - Get my applications
- `POST /api/applications` - Submit application (with resume upload)
- `PUT /api/applications/:id/status` - Update application status (Admin/HR only)
- `DELETE /api/applications/:id` - Delete application (Admin/HR only)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics (Admin/HR only)
- `GET /api/analytics/workforce` - Workforce metrics (Admin/HR only)

## Default Credentials

After seeding:
- **Admin**: admin@AloraBridge.com / Admin123!
- **HR**: hr@AloraBridge.com / Hr123!

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
src/
├── config/
│   ├── database.ts    # Prisma client
│   └── env.ts         # Environment variables
├── controllers/
│   ├── authController.ts
│   ├── jobController.ts
│   ├── applicationController.ts
│   └── analyticsController.ts
├── middleware/
│   ├── auth.ts        # JWT authentication
│   ├── errorHandler.ts
│   ├── upload.ts      # File upload config
│   └── validator.ts   # Request validation
├── routes/
│   ├── authRoutes.ts
│   ├── jobRoutes.ts
│   ├── applicationRoutes.ts
│   └── analyticsRoutes.ts
├── utils/
│   ├── logger.ts      # Winston logger
│   └── email.ts       # Email service
└── server.ts          # Express app
```

## Security Features

- JWT authentication with role-based access control
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- Secure file upload with type and size restrictions
- SQL injection prevention via Prisma ORM

## License

MIT
