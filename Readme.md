Movie Ticket Booking System
===========================

Stack
 - Frontend: React + Vite + TypeScript
 - Backend: Node.js + Express + TypeScript
 - DB: MongoDB (Mongoose)
 - Auth: JWT (httpOnly cookie), bcrypt

Features
 - Signup/Login with validation and secure password hashing
 - List movies and showtimes
 - Seat selection and atomic multi-seat booking
 - View "My Bookings"

Local Setup
1) Server
 - cd server
 - Create .env
   PORT=3000
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   FRONTEND_ORIGIN=http://localhost:5173
 - npm install
 - npm run dev

2) Client
 - cd client
 - Create .env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
 - npm install
 - npm run dev

Key Endpoints
 - POST /api/v1/user/signup
 - POST /api/v1/user/login
 - POST /api/v1/user/logout
 - GET  /api/v1/user
 - GET  /api/v1/movie/fetch-movies
 - GET  /api/v1/movie/check-shows/:movieId
 - POST /api/v1/booking/book-seat { showId, seatIds: string[] }
 - GET  /api/v1/booking/my

Deployment
 - Host server on any Node-compatible platform (set env vars above and CORS FRONTEND_ORIGIN)
 - Host client (set VITE_API_BASE_URL to your live API base URL)

Test User
 - email: test@example.com
 - password: Test@123

Notes
 - Ensure the server sends/accepts credentials and your frontend fetch uses credentials: include.
 - For pricing set SEAT_PRICE env (default 200) on server if needed.


