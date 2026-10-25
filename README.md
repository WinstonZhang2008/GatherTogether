**Status:** Built summer 2026 as a side project with friends. The backend (auth, plans, polls, availability, notifications) is functional; the React Native frontend is partial. Not deployed.
# Gather — Group Planning App

A lightweight mobile app that eliminates the chaos of coordinating plans over text. Create a plan, invite friends, sync availability, vote on a venue, and confirm — all in one place.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | React Native |
| Backend | Flask (Python) |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (flask-jwt-extended) |
| Real-time | Supabase Realtime |
| Notifications | Expo Push + Twilio |
| Calendar | Google Calendar API |

---

## Project Structure

```
GatherTogether/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Flask app factory
│   │   ├── config.py           # Environment config
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── plan.py
│   │   │   ├── poll.py
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
│   │       ├── __init__.py
│   │       └── helpers.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    └── src/
        ├── components/
        ├── context/
        │   └── AuthContext.js
        ├── navigation/
        │   └── AppNavigator.js
        ├── screens/
        │   ├── auth/
        │   │   ├── LoginScreen.js
        │   │   └── SignupScreen.js
        │   ├── plans/
        │   │   ├── HomeScreen.js
        │   │   ├── CreatePlanScreen.js
        │   │   └── PlanDetailScreen.js
        │   ├── availability/
        │   │   └── AvailabilityScreen.js
        │   ├── polls/
        │   │   └── PollScreen.js
        │   └── profile/
        │       └── ProfileScreen.js
        ├── services/
        │   ├── api.js
        │   └── auth.js
        └── utils/
            └── helpers.js
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js
- Expo CLI
- A Supabase account

### Backend Setup

1. Clone the repo:
```bash
git clone https://github.com/yourname/gathertogether.git
cd gathertogether/backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the `backend/` folder:
```
SECRET_KEY=your_secret_key_here
DATABASE_URL=postgresql://postgres:yourpassword@db.xxxx.supabase.co:5432/postgres
JWT_SECRET_KEY=your_jwt_secret_key_here
```

4. Run the server:
```bash
python main.py
```

The backend will be running at `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd gathertogether/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the app:
```bash
npx expo start
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Create a new account | No |
| POST | /api/auth/login | Sign in | No |
| GET | /api/auth/me | Get current user | Yes |

### Plans
| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | /api/plans/ | Get all your plans | Yes |
| POST | /api/plans/ | Create a new plan | Yes |
| GET | /api/plans/:id | Get one plan | Yes |
| PUT | /api/plans/:id | Update a plan | Yes |
| DELETE | /api/plans/:id | Delete a plan | Yes |

### Availability
| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | /api/availability/ | Submit your availability | Yes |
| GET | /api/availability/:plan_id | Get availability for a plan | Yes |

### Polls
| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | /api/polls/ | Create a poll | Yes |
| GET | /api/polls/:plan_id | Get polls for a plan | Yes |
| POST | /api/polls/:id/vote | Cast a vote | Yes |

### Notifications
| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | /api/notifications/ | Get your notifications | Yes |
| PUT | /api/notifications/:id/read | Mark as read | Yes |

---

## Team

| Person | Responsibility |
|--------|---------------|
| Dev 1 | Backend — API, database, auth, notifications |
| Dev 2 | Frontend — screens, navigation, UI components |
| Dev 3 | Features — real-time sync, calendar API, polls |

---

## Development Timeline

| Phase | Weeks | Goals |
|-------|-------|-------|
| Setup | 1–2 | Repo, design system, DB schema, auth, navigation |
| MVP | 3–5 | Create plan, invite flow, availability picker |
| Core features | 6–8 | Polls, voting, notifications, confirmed plan view |
| Polish | 9–10 | Preferences, dietary flags, calendar export, bug fixes |
| Launch | 11–12 | AI suggestions, expense split, deploy to stores |
