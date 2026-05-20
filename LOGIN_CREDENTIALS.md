# Login credentials (reference)

This file is a **single place to look up** demo and development login details used by Ride Fare Comparator. Passwords here match what the backend seeds and mock data define—**not for production use**.

## App login (mobile / API)

| Email | Password | Display name | Notes |
|--------|-----------|----------------|--------|
| `test@example.com` | `password123` | Test User | Default seeded / mock user |

### Where these are defined in the repo

| Location | Role |
|----------|------|
| `backend/database/seed.js` | MongoDB seed creates this user (hashed password). |
| `backend/data/mockStore.js` | In-memory mock user list (same email; hash matches `password123`). |
| `backend/database/schema.sql` | SQL sample insert with the same bcrypt hash for `password123`. |

New accounts created via **Register** in the app are stored by whichever backend mode you run (MongoDB or mock), not in this document—add a row here if you want to track extra test users.

## What is *not* stored in a file (client)

- **Passwords** are not saved to disk by the app; login sends them to the API once.
- After login, the **JWT and public user fields** are persisted by the Expo app under AsyncStorage key `auth-storage` (see `frontend/src/stores/authStore.js`). That is a session token, not a copy of the password.

## Security

- Treat this document and demo passwords as **development-only**.
- Do not put real user or production secrets in this file or commit them to git.
