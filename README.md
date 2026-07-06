# Connectify

Connectify is a lightweight social networking app with real-time messaging, posts, groups, friend requests, and user profiles. It uses a Node.js + Express backend with MongoDB and a React + Vite frontend. Socket.IO handles real-time chat and notifications.

## Features

- User authentication (JWT)
- Profiles with avatar upload (Cloudinary)
- Create, like, and comment on posts
- Real-time private and group messaging (Socket.IO)
- Friend requests and friends list
- Group creation and member management

## Tech stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite, Tailwind CSS (optional)
- Real-time: Socket.IO
- File uploads: Multer + Cloudinary

## Project structure

- `backend/` — Express server, controllers, models, routes, socket handlers
- `frontend/` — React app (Vite)

## Prerequisites

- Node.js >= 16
- npm or yarn
- MongoDB (local or hosted)
- Cloudinary account (for image uploads) — optional but recommended

## Environment variables

Create a `.env` file in `backend/` with at least:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for JWT tokens
- `PORT` — (optional) backend port, default 5000
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for Cloudinary uploads

In the frontend, you can set:

- `VITE_API_URL` — base URL for the backend API (e.g. http://localhost:5000)

## Install & run

Backend

```bash
cd backend
npm install
# start server
node server.js
# (optional) for development with auto-restart:
npx nodemon server.js
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at the address shown by Vite (usually http://localhost:5173) and ensure the backend `VITE_API_URL`/CORS are configured correctly.

## Testing sockets Locally

- Start the backend server, then the frontend. Use two browser windows to log in as different users to test real-time messaging and notifications.