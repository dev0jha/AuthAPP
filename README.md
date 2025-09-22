# AuthApp

A lightweight authentication app built with Next.js (App Router), MongoDB (Mongoose), and JWT httpOnly cookies. Supports Signup, Login, Logout, and Email Verification.

## Features
- Signup with hashed passwords (bcrypt)
- Login with JWT stored as httpOnly cookie (`token`)
- Logout (clears cookie)
- Email verification via token link
- API routes implemented in Next.js App Router

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Mongoose 8 (MongoDB)
- bcryptjs, jsonwebtoken, nodemailer
- Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- MongoDB instance (local or MongoDB Atlas)

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a `.env.local` at the project root:

```ini
# MongoDB connection string
mongo_url=mongodb://127.0.0.1:27017/authapp

# Secret for signing JWTs (use a strong random string)
TOKEN_SECRET=replace_with_a_strong_random_secret

# Optional: base URL used in verification emails
# If omitted, defaults to http://localhost:3000
# domain=https://your-domain.tld
```

Tips
- For MongoDB Atlas, set `mongo_url` to your SRV connection string (mongodb+srv://...).
- Keep secrets out of source control.

### 3) Run the dev server
```bash
npm run dev
```
App: http://localhost:3000

## App Pages
- Signup: `/signup`
- Login: `/login`
- Profile: `/profile`
- Verify Email: `/verifyemail`

## API Reference
All responses are JSON. Routes live under `src/app/api`.

- POST `/api/user/signup`
  - Body: `{ "username": string, "email": string, "password": string }`
  - 200: `{ message: "User created successfully", success: true, savedUser: {...} }`
  - 400: `{ error: "User already exists" }`
  - 500: `{ error: string }`

- POST `/api/user/login`
  - Body: `{ "email": string, "password": string }`
  - Sets an httpOnly cookie `token` on success
  - 200: `{ message: "Login successful", success: true }`
  - 401: `{ error: "Invalid password" }`
  - 404: `{ error: "User not found" }`
  - 500/503: `{ error: string }` (503 if DB unreachable)

- GET `/api/user/logout`
  - Clears the `token` cookie
  - 200: `{ message: "Logged out successfully", success: true }`

- POST `/api/user/verifyEmail`
  - Body: `{ "token": string }`
  - 200: `{ message: "Email verified successfully", success: true }`
  - 400: `{ message: "Invalid or expired token" }`
  - 500: `{ message: string }`

## Email Verification Flow
1) On signup, a hashed token is stored on the user document: `verifyToken`, `verifyTokenExpiry`.
2) An email is sent containing a link to:
   - `${domain or http://localhost:3000}/verifyemail?token=<token>&id=<userId>`
3) The `/verifyemail` page reads the token from the URL and calls `POST /api/user/verifyEmail`.

Implementation details
- `src/helper/mailer.ts` constructs the link with:
  - Path `/verifyemail` to match the page
  - `token` and `id` URL-encoded
  - `process.env.domain` fallback to `http://localhost:3000`

## Important Implementation Notes
- DB connection: `src/app/dbConfig/dbConfig.ts` connects on-demand inside route handlers and fails fast (`serverSelectionTimeoutMS: 5000`). This avoids import-time crashes and long buffer timeouts.
- Login route guards missing `TOKEN_SECRET`.
- Logout route is singular: `/api/user/logout` (client calls updated accordingly).
- Verify email route connects to DB inside the handler and returns meaningful error messages.

## Troubleshooting
- 503 or long timeouts on login:
  - Ensure `mongo_url` is correct and MongoDB is reachable.
  - If running locally, start MongoDB (or switch to an Atlas connection string).
- 404 on logout:
  - Use `/api/user/logout` (singular `user`).
- Email link 404:
  - Link must be `/verifyemail` (no hyphen). Ensure `token` and `id` are URL-encoded.
  - Set `domain` if you’re not using localhost.
- Verify page 500s:
  - `src/app/verifyemail/page.tsx` is a client component ("use client") and only calls the API once per token.

## Scripts
- `npm run dev` – Start Next.js dev server
- `npm run build` – Build for production
- `npm start` – Start the production server

## License
Provided as-is. Add a license file if you plan to distribute.
