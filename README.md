# ToDo App

A fullstack ToDo application with authentication, built using:

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** Next.js (App Router, TypeScript, TailwindCSS)

---

## Features

- User authentication (signup, login, JWT-based sessions)
- Protected routes (dashboard, todos)
- Add, view, complete, and delete todos
- Each todo supports a title and description
- Responsive, modern UI

---

## Project Structure

```
ToDo_Test/
  BackEnd/        # Node.js/Express backend
  frontend/       # Next.js frontend
```

---

## Getting Started

### 1. Backend Setup

```bash
cd BackEnd
npm install
```

#### Create a `.env` file in `BackEnd/`:

```
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

#### Start the backend:

```bash
npm start
# or
node index.js
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

#### Create a `.env.local` file in `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

- For Vercel deployment, set `NEXT_PUBLIC_API_URL` in the Vercel dashboard to your backend's deployed URL.

#### Start the frontend:

```bash
npm run dev
```

---

## Usage

- Visit `http://localhost:3000` (or your Vercel URL)
- You will be redirected to the login page
- Sign up or log in
- Use the dashboard to manage your todos

---

## Deployment

- **Frontend:** Deploy the `frontend/` folder to Vercel
- **Backend:** Deploy the `BackEnd/` folder to your preferred Node.js host (e.g., Render, Railway, Heroku, or your own server)
- Set the `NEXT_PUBLIC_API_URL` environment variable in Vercel to point to your backend's deployed URL

---

## Environment Variables

### Backend (`BackEnd/.env`):

- `PORT` - Port for the backend server (default: 8080)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing

### Frontend (`frontend/.env.local`):

- `NEXT_PUBLIC_API_URL` - Base URL for backend API (e.g., `http://localhost:8080` or your production backend URL)

---

## License

MIT
