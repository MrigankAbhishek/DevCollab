# DevCollab

Real-time collaborative coding platform built with the MERN stack + Socket.io.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Monaco Editor + React DnD
- **Backend**: Node.js + Express + Socket.io
- **Database**: MongoDB (Atlas)
- **Auth**: GitHub OAuth + JWT via Passport.js
- **Storage**: Cloudinary (file uploads)
- **Deploy**: Vercel (frontend) + Railway (backend) + MongoDB Atlas (DB)

## Features

- Real-time collaborative code editor (Monaco)
- Language switching synced across all users
- Live chat per room
- Drag-and-drop Kanban task board synced in real-time
- File/snippet uploads via Cloudinary
- GitHub OAuth authentication
- Room invite codes
- Role-based access (owner vs member)
- Online user presence indicators

## Project Structure

```
devcollab/
├── server/
│   ├── config/passport.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   ├── tasks.js
│   │   └── files.js
│   ├── socket/index.js
│   ├── index.js
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Editor.jsx
    │   │   ├── Chat.jsx
    │   │   ├── KanbanBoard.jsx
    │   │   ├── FileUpload.jsx
    │   │   └── OnlineUsers.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── RoomPage.jsx
    │   │   └── AuthCallback.jsx
    │   ├── socket.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Setup

### 1. GitHub OAuth App

Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App

- **Homepage URL**: `http://localhost:5173`
- **Authorization callback URL**: `http://localhost:5000/api/auth/github/callback`

Copy the Client ID and Client Secret.

### 2. MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user
3. Get the connection string (replace `<password>`)

### 3. Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard

### 4. Backend Setup

```bash
cd server
cp .env.example .env
```

Fill in your `.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=any_long_random_string
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

```bash
npm install
npm run dev
```

### 5. Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deployment

### Frontend → Vercel

```bash
cd client
npm run build
```

Import the `client` folder to [vercel.com](https://vercel.com). Set env var:
- `VITE_SERVER_URL` = your Railway backend URL

### Backend → Railway

Import the `server` folder to [railway.app](https://railway.app). Add all env vars from `.env.example` with production values. Update `CLIENT_URL` to your Vercel URL and `SERVER_URL` to your Railway URL.

### Update GitHub OAuth Callback

In your GitHub OAuth App settings, add the production callback URL:
`https://your-railway-url.railway.app/api/auth/github/callback`

## Resume Bullet Points

After deploying, write these in your resume:

- Built a real-time collaborative code editor supporting concurrent users via Socket.io with room-based session isolation
- Implemented GitHub OAuth authentication with JWT and role-based access control (room owner vs member)
- Developed drag-and-drop Kanban board with real-time sync across all active room members using WebSocket events
- Deployed full MERN stack application with CI/CD on Vercel + Railway; file storage via Cloudinary
