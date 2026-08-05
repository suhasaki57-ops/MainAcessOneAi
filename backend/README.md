# ascess-1-ai Backend API

Production-ready, scalable Express.js backend infrastructure powered by Supabase PostgreSQL, JWT authentication, and Google Gemini AI integration.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   - `PORT`
   - `JWT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`

3. Initialize Database Schema:
   Execute `src/database/schema.sql` in your Supabase SQL Editor.

4. Start Development Server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `src/config/`: Application environment configurations
- `src/controllers/`: Route handlers
- `src/database/`: SQL migrations and schemas
- `src/middleware/`: Auth, error handling, validation, file upload
- `src/routes/`: Express endpoint routing setup
- `src/services/`: Core logic layer
- `src/supabase/`: Supabase PostgreSQL client and queries
- `src/validations/`: Zod request schemas
- `src/ai/`: Google Gemini AI engine client
