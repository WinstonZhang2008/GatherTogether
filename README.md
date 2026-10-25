# Gather — Group Planning App

A lightweight mobile app that eliminates the chaos of coordinating plans over text. Create a plan, invite friends, sync availability, vote on a venue, and confirm, all in one place.

**Status:** Built summer 2026 as a side project with friends. The backend (auth, plans, polls, availability, notifications) is functional; the React Native frontend is partial. Not deployed.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | React Native |
| Backend | Flask (Python) |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (flask-jwt-extended), Google OAuth |
| Email | Flask-Mail (verification, password reset) |

---

## Project Structure

```
GatherTogether/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Flask app factory
│   │   ├── config.py           # Environment config
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── plan.py
│   │   │   ├── poll.py         # Poll, PollOption, Vote
│   │   │   ├── availability.py
│   │   │   └── notification.py
│   │   ├── routes/
│   │   │   ├── __init__.py     # Blueprint registration
│   │   │   ├── auth.py
│   │   │   ├── plans.py
│   │   │   ├── polls.py
│   │   │   ├── availability.py
│   │   │   └── notifications.py
│   │   └── utils/
│   │       ├── helpers.py
│   │       └── email.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── components/
        ├── context/
        │   └── AuthContext.js
        ├── navigation/
        │   └── AppNavigator.js
        ├── screens/
        │   ├── auth/
        │   ├── plans/
        │   ├── availability/
        │   ├── polls/
        │   └── profile/
        ├── services/
        │   └── api.js
        └── utils/
            └── helpers.js
```

---

## Data Model

| Table | Key fields | Relationships |
|-------|-----------|---------------|
| users | name, email (unique), password_hash, is_verified, dietary_tags, budget_range | creator of plans |
| plans | title, description, location, category, date range, final time, status | belongs to a user; has availabilities, polls, notifications |
| availabilities | available_slots (JSON), note | belongs to a user and a plan |
| polls | question, is_closed | belongs to a plan; has options |
| poll_options | option_text | belongs to a poll; has votes |
| votes | created_at | belongs to a user and an option |
| notifications | message, type, is_read | belongs to a user; optionally to a plan |

All child rows cascade on delete.

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js
- Expo CLI
- A Supabase account (or any PostgreSQL database)

### Backend Setup

1. Clone and enter the backend:
```bash
git clone https://github.com/WinstonZhang2008/GatherTogether.git
cd GatherTogether/backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in `backend/` (see `.env.example`):
```
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
DATABASE_URL=postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
MAIL_USERNAME=your_gmail_address
MAIL_PASSWORD=your_gmail_app_password
```

4. Run the server:
```bash
python main.py
```

The backend runs at `http://127.0.0.1:5000`.

### Frontend Setup

```bash
cd GatherTogether/frontend
npm install
npx expo start
```

---

## API Endpoints

All protected routes expect an `Authorization: Bearer <token>` header.

### Auth (`/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Create an account; sends a verification email | No |
| GET | `/auth/verify/<token>` | Verify an email address | No |
| POST | `/auth/login` | Sign in; returns a JWT | No |
| POST | `/auth/google` | Sign in with a Google ID token | No |
| POST | `/auth/forgot-password` | Send a password reset email | No |
| GET | `/auth/me` | Get the current user | Yes |
| PUT | `/auth/me` | Update the current user's profile | Yes |

### Plans (`/plans`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/plans/` | List the current user's plans | Yes |
| POST | `/plans/` | Create a plan | Yes |
| GET | `/plans/<plan_id>` | Get one plan | Yes |
| PUT | `/plans/<plan_id>` | Update a plan | Yes |
| DELETE | `/plans/<plan_id>` | Delete a plan | Yes |

### Availability (`/availability`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/availability/<plan_id>` | Submit or replace your availability | Yes |
| GET | `/availability/<plan_id>` | Get every participant's availability | Yes |
| DELETE | `/availability/<plan_id>` | Remove your availability | Yes |

### Polls (`/polls`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/polls/<plan_id>` | Create a poll with options | Yes |
| POST | `/polls/vote/<option_id>` | Cast a vote, or remove it if already cast | Yes |
| GET | `/polls/<plan_id>` | Get poll results with vote tallies | Yes |

### Notifications (`/notifications`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/notifications/` | List notifications | Yes |
| PUT | `/notifications/<id>/read` | Mark one as read | Yes |
| PUT | `/notifications/read-all` | Mark all as read | Yes |

---

## Team

Three-person project. I built the backend: the database schema, the REST API, JWT and Google OAuth authentication, email verification and password reset, and the notification system. My teammates built the React Native frontend.
