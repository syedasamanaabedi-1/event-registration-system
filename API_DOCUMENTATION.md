# API Documentation

Base URL (local): `http://localhost:5000/api`
Base URL (deployed): `https://event-registration-backend-b1a2.onrender.com/api`

## All protected routes require a header:

## Auth Routes (`/auth`)

### Register

`POST /auth/register`

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "attendee"
}
```

### Login

`POST /auth/login`

Body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response (both):

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "attendee",
  "token": "..."
}
```

---

## Event Routes (`/events`)

### Get all published events (public)

`GET /events?search=&category=&city=&date=&page=1&limit=10`

### Get single event (public)

`GET /events/:id`

### Get organizer's own events (organizer only)

`GET /events/my/events`

### Get all events for admin (admin only)

`GET /events/admin/all`

### Create event (organizer only)

`POST /events`

Body:

```json
{
  "title": "Career Fair 2026",
  "description": "Annual career fair",
  "venue": "Expo Center",
  "city": "Islamabad",
  "startAt": "2026-09-25T10:00:00.000Z",
  "endAt": "2026-09-25T16:00:00.000Z",
  "capacity": 100,
  "registrationDeadline": "2026-09-23T23:59:00.000Z",
  "cancellationDeadline": "2026-09-24T23:59:00.000Z"
}
```

### Update event (organizer only, own event)

`PATCH /events/:id`

### Approve event (admin only)

`PATCH /events/:id/approve`

### Publish event (admin only)

`PATCH /events/:id/publish`

### Register for event (attendee only)

`POST /events/:id/register`

### Get event registrations (organizer/admin)

`GET /events/:id/registrations`

---

## Registration Routes (`/registrations`)

### Cancel registration (attendee, own registration)

`PATCH /registrations/:id/cancel`

### Mark attendance (organizer/admin)

`PATCH /registrations/:id/attendance`

Body:

```json
{
  "attendanceStatus": "present"
}
```

---

## Dashboard Routes (`/dashboard`)

### Organizer dashboard

`GET /dashboard/organizer`

### Admin dashboard

`GET /dashboard/admin`

### Attendee dashboard

`GET /dashboard/attendee`

---

## Category Routes (`/categories`)

### Get all categories (public)

`GET /categories`

### Create category (admin only)

`POST /categories`

Body:

```json
{
  "name": "Workshop"
}
```

### Update category (admin only)

`PATCH /categories/:id`

### Delete/deactivate category (admin only)

`DELETE /categories/:id`

---

## User Routes (`/users`)

### Get all users (admin only)

`GET /users`

---

## Demo Accounts

| Role      | Email              | Password    |
| --------- | ------------------ | ----------- |
| Admin     | admin@demo.com     | password123 |
| Organizer | organizer@demo.com | password123 |
| Attendee  | attendee@demo.com  | password123 |
