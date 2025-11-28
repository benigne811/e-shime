# E-SHIME

E-SHIME is a mental health web platform designed for African youth, combining mood tracking, counseling, peer stories, and therapist booking in a culturally grounded way.

This repository is a **E-SHIME** containing both the frontend (React + Vite) and backend (Node.js + Express + MySQL).

---

## Tech stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MySQL
- **AI counselor:** OpenRouter (GPT-4o-mini)

---

## Project structure

- `e-shime/` – React + Vite frontend
- `E-SHIME_Backend/` – Node.js + Express API & Socket.IO server
  - `DATABASE_SCHEMA.md` – detailed description of the MySQL schema
  - `DATABASE_SQL_SIMPLE.md` – simple SQL script to create required tables

All commands below assume your terminal is open in the project root directory (`E-SHIME`).

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** v18+ (LTS recommended) and **npm**
- **MySQL** (5.7+ or 8.x) running locally or in the cloud
- **Git** (to clone the repository)
- (Optional, but recommended) Accounts for:
  - **OpenRouter** – for the AI counselor (`OPENROUTER_API_KEY`)
---

## 1. Clone the repository

1. In your terminal:
   ```bash
   git clone https://github.com/benigne811/E-SHIME.git
   cd E-SHIME
   ```


---

## 2. Backend setup (API & Socket server)

### 2.1 Install backend dependencies

From the project root:

```bash
cd E-SHIME_Backend
npm install
```

### 2.2 Configure backend environment variables

In the `E-SHIME_Backend` folder, create a file named `.env`:
 echo "" > .env
 or 
 touch .env

```bash
# MySQL connection
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=eshime_db

# HTTP & WebSocket server
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Authentication
JWT_SECRET=your_very_secret_jwt_key
JWT_EXPIRE=7d

# AI counselor (required for AI therapist chat)
OPENROUTER_API_KEY=your_openrouter_api_key

# Environment
NODE_ENV=development
```

**Notes:**
- `DB_*` values must match your MySQL setup.
- `PORT` is the backend port. The frontend is configured to talk to `http://localhost:5000` by default.
- `CORS_ORIGIN` **must** match the frontend URL. In development it is `http://localhost:3000` (see `e-shime/vite.config.ts`).
- If you do **not** configure `OPENROUTER_API_KEY`, the AI counselor will show a friendly fallback message instead of smart responses.
- If you do **not** configure the Cloudinary variables, features that upload media may fail.

### 2.3 Create the MySQL database & tables

1. Make sure your MySQL server is running.
2. Open a MySQL client (CLI, Workbench, etc.).
3. Create the database and tables by running the SQL in `E-SHIME_Backend/DATABASE_SQL_SIMPLE.md`.
   - For example, using the CLI:
     ```bash
     mysql -u your_mysql_user -p
     ```
     Then paste the contents of `DATABASE_SQL_SIMPLE.md` into the MySQL prompt and execute.
4. Confirm that the database `eshime_db` and its tables (`users`, `therapists`, `bookings`, `stories`, `mood_logs`, `messages`, etc.) exist.

> For a more detailed explanation of the schema, see `E-SHIME_Backend/DATABASE_SCHEMA.md`.

### 2.4 Run the backend server

From inside `E-SHIME_Backend`:

- Development (with auto-restart using `nodemon`):
  ```bash
  npm run devStart
  ```
- Production-style run:
  ```bash
  npm start
  ```

If everything is configured correctly you should see logs indicating that the database connected and the server started on the configured port.

You can also test the health endpoint in your browser or via `curl`:

```bash
http://localhost:5000/health
```

You should receive a small JSON response confirming that the backend is running.

Keep this backend process running while you work with the frontend.

---

## 3. Frontend setup (React + Vite)

### 3.1 Install frontend dependencies

From the project root (if you are still in `E-SHIME_Backend`, go one level up first with `cd ..`):

```bash
cd e-shime
npm install
```

### 3.2 (Optional) Configure frontend environment variables

By default, the frontend points to `http://localhost:5000` for the API and Socket.IO, so **you can skip this step** if you follow the ports above.

If you want to customize the backend URL or port, create a `.env` file in `e-shime`:

```bash
VITE_API_BASE=http://localhost:5000
VITE_SOCKET_BASE=http://localhost:5000
```

Update these values if your backend is running on a different host/port.

### 3.3 Run the frontend dev server

From inside `e-shime`:

```bash
npm run dev
```

Vite is configured to start the dev server on:

```text
http://localhost:3000
```

Open that URL in your browser to see the E-SHIME interface.

> Make sure the backend (`E-SHIME_Backend`) is running **before** logging in, registering, or using any API-driven features.

---

## 4. Running the full stack (step-by-step)

1. **Start the backend**
   - Terminal 1:
     ```bash
     cd E-SHIME_Backend
     npm install        # only needed the first time
     npm run devStart   # or: npm start
     ```
2. **Start the frontend**
   - Terminal 2:
     ```bash
     cd e-shime
     npm install   # only needed the first time
     npm run dev
     ```
3. **Open the app**
   - Go to `http://localhost:3000` in your browser.
4. **Create a user account**
   - Click **Register**, fill in the form, and submit.
5. **Log in**
   - Use the credentials you just registered on the **Login** page.
6. **Explore the features**
   - Dashboard & mood tracking
   - AI counselor chat (requires `OPENROUTER_API_KEY` configured)
   - Peer stories & creative therapy sections
   - Therapist booking

Once these steps work, your local E-SHIME environment is up and running.

---

## 5. Useful scripts

### Backend (`E-SHIME_Backend`)

- `npm start` – start the Express + Socket.IO server.
- `npm run devStart` – start the server with `nodemon` (auto-restarts on file changes).

### Frontend (`e-shime`)

- `npm run dev` – start the Vite dev server at `http://localhost:3000`.
- `npm run build` – build the production-ready frontend into `e-shime/build`.

---

## 6. Deployment notes (high level)

For production deployment you will typically:

1. **Backend**
   - Deploy `E-SHIME_Backend` to a Node-friendly host (Render, Railway, VPS, etc.).
   - Point it to a managed MySQL instance.
   - Set all environment variables from section **2.2** in your host’s dashboard.

2. **Frontend**
   - In `e-shime`, run `npm run build` and deploy the generated static files (`build/`) to a static host (Vercel, Netlify, etc.).
   - Set `VITE_API_BASE` and `VITE_SOCKET_BASE` to the public URL of your backend before building.

If you only need local development, you can ignore this section.

---

## 7. Troubleshooting

- **Backend cannot connect to MySQL**
  - Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `E-SHIME_Backend/.env`.
  - Make sure the SQL from `DATABASE_SQL_SIMPLE.md` has been executed.
- **CORS or Socket.IO errors in browser console**
  - Confirm `CORS_ORIGIN` in `E-SHIME_Backend/.env` matches the exact frontend URL (including port).
- **AI counselor not responding properly**
  - Ensure `OPENROUTER_API_KEY` is set in the backend `.env` and valid.
- **Media upload errors**
  - Ensure Cloudinary credentials are correct and the account is active.

If you run into issues that are not covered here, check the backend logs (terminal running `E-SHIME_Backend`) and frontend console (browser dev tools) for more details.