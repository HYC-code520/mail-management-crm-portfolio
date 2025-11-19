# Backend API - Mail Management System

Express.js backend API for the Mail Management System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials from the main project's `.env.local`

## Development

Run the development server with auto-reload:
```bash
npm run dev
```

Server will start on http://localhost:5000

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### Contacts (All require authentication)
- `GET /api/contacts` - List all contacts (with optional filters)
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/:id` - Get single contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Soft delete contact

### Authentication

All API routes (except `/health`) require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN
```

## Testing

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Test contacts endpoint (requires token):
```bash
curl http://localhost:5000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth, error handling
│   ├── routes/          # API route definitions
│   ├── services/        # External services (Supabase)
│   └── server.js        # Express app entry point
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
└── package.json
```

## Next Steps

- [ ] Migrate mail-items routes
- [ ] Migrate messages routes
- [ ] Migrate templates routes
- [ ] Add input validation (Zod)
- [ ] Add unit tests
- [ ] Deploy to Vercel

