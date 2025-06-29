# Portfolio Admin Dashboard

A comprehensive portfolio application with admin control built with Next.js 15, TypeScript, Tailwind CSS, Drizzle ORM, and Docker.

## Features

### Front-end
- Modern, responsive portfolio website
- Hero section with personal branding
- Projects showcase with filtering
- Skills display with categories and levels
- Work experience timeline
- Contact form with validation
- Built with Next.js 15 and TypeScript

### Back-end
- RESTful API with Next.js API routes
- JWT-based authentication
- CRUD operations for all content
- Server-side validation
- Secure admin authentication

### Database
- PostgreSQL database with Drizzle ORM
- Type-safe database operations
- Automated migrations
- Seed data for development

### Admin Panel
- Secure login system
- Dashboard with overview statistics
- Projects management (CRUD)
- Skills management
- Experience management
- Contact form submissions
- Real-time content updates

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL, Drizzle ORM
- **Authentication**: JWT, bcryptjs
- **UI Components**: Radix UI, shadcn/ui
- **Containerization**: Docker, Docker Compose
- **Database Management**: Beekeeper Studio compatible

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd portfolio-admin
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start the development environment with Docker:
\`\`\`bash
docker-compose up -d
\`\`\`

5. Run database migrations:
\`\`\`bash
npm run db:generate
npm run db:migrate
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at:
- Portfolio: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Database Admin (Adminer): http://localhost:8080

### Default Admin Credentials

- Email: admin@portfolio.com
- Password: admin123

**⚠️ Change these credentials in production!**

## Database Management with Beekeeper Studio

1. Download and install [Beekeeper Studio](https://www.beekeeperstudio.io/)
2. Connect to your PostgreSQL database:
   - Host: localhost
   - Port: 5432
   - Database: portfolio
   - Username: postgres
   - Password: password

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   └── page.tsx           # Portfolio homepage
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and configurations
│   ├── db/                # Database schema and connection
│   └── auth.ts            # Authentication utilities
├── scripts/               # Database scripts
├── docker-compose.yml     # Docker configuration
├── Dockerfile            # Container configuration
└── drizzle.config.ts     # Drizzle ORM configuration
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/[id]` - Update skill
- `DELETE /api/skills/[id]` - Delete skill

### Experience
- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create experience
- `PUT /api/experiences/[id]` - Update experience
- `DELETE /api/experiences/[id]` - Delete experience

### Contact
- `GET /api/contact` - Get contact messages
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/[id]` - Mark message as read

## Deployment

### Production with Docker

1. Build the production image:
\`\`\`bash
docker-compose -f docker-compose.prod.yml up --build
\`\`\`

2. The application will be available on port 3000

### Environment Variables for Production

\`\`\`env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV="production"
\`\`\`

## Development

### Database Operations

\`\`\`bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
\`\`\`

### Adding New Features

1. Update database schema in `lib/db/schema.ts`
2. Generate and run migrations
3. Create API routes in `app/api/`
4. Add admin components in `components/admin/`
5. Update the admin dashboard

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- HTTP-only cookies for token storage
- CORS protection
- Input validation and sanitization
- SQL injection prevention with Drizzle ORM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`

This comprehensive portfolio application includes:

1. **Front-end**: A modern, responsive portfolio website with hero section, projects showcase, skills display, experience timeline, and contact form
2. **Back-end**: RESTful API with Next.js API routes, JWT authentication, and CRUD operations
3. **Database**: PostgreSQL with Drizzle ORM for type-safe operations
4. **Admin Panel**: Secure dashboard for content management
5. **Docker**: Complete containerization with Docker Compose
6. **Beekeeper Studio**: Database management compatibility

The application is production-ready with proper security measures, error handling, and scalable architecture.
