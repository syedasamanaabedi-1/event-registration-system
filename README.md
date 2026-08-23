# Event Registration & Attendance System

A MERN stack platform where organizers publish events with limited seats, attendees register and manage bookings, and admins approve events and track platform activity.

## Features

- Role-based authentication (Attendee, Organizer, Admin) with JWT
- Event creation, admin approval, and publishing workflow
- Seat-limited registration with duplicate prevention
- Booking cancellation before deadline
- Attendance marking (Present/Absent) with time-based restrictions
- Role-specific dashboards with aggregated statistics
- Category management

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas) with Mongoose
- **Auth:** JWT, bcryptjs

## Project Structure

# Event Registration & Attendance System

A MERN stack platform where organizers publish events with limited seats, attendees register and manage bookings, and admins approve events and track platform activity.

## Features

- Role-based authentication (Attendee, Organizer, Admin) with JWT
- Event creation, admin approval, and publishing workflow
- Seat-limited registration with duplicate prevention
- Booking cancellation before deadline
- Attendance marking (Present/Absent) with time-based restrictions
- Role-specific dashboards with aggregated statistics
- Category management

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas) with Mongoose
- **Auth:** JWT, bcryptjs

## Project Structure

    project/
      client/   -> React frontend
      server/   -> Node/Express backend

## Installation & Setup

### Backend

    cd server
    npm install

Create a `.env` file in `server/` with:

    PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=7d

Run the backend:

    node server.js

### Frontend

    cd client
    npm install
    npm run dev

## Seed Demo Data

To populate the database with test accounts and sample events:

    cd server
    node seed.js

## Demo / Test Accounts

| Role      | Email              | Password    |
| --------- | ------------------ | ----------- |
| Admin     | admin@demo.com     | password123 |
| Organizer | organizer@demo.com | password123 |
| Attendee  | attendee@demo.com  | password123 |

## API Base URL

Local: `http://localhost:5000/api`

## Deployed URLs

- Frontend: (to be added after deployment)
- Backend: (to be added after deployment)

## Roles & Permissions

- **Attendee:** Browse events, register, cancel booking, view booking history
- **Organizer:** Create/manage own events, view registrations, mark attendance
- **Admin:** Approve/publish events, view all users, platform-wide analytics
