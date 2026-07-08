# Hospital Food Delivery Management System

Hospital Food Delivery Management System is a full-stack web application for managing patient meal deliveries inside a hospital.  
It supports role-based workflows for Admin, Pantry, and Delivery staff.

## Features

- User authentication (register/login) with role-based navigation
- Patient management (create, view, update, delete)
- Meal delivery management (create deliveries, track/update delivery status)
- Admin dashboard with delivery and patient insights
- Pantry and Delivery dashboards for operational workflows

## Tech Stack

### Frontend
- React (Create React App)
- Chakra UI
- React Router
- Axios
- Recharts

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs

## Project Structure

```text
Hospital-Food-Delivery-Management-System/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
└── frontend/
    ├── src/
    └── package.json
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB instance (local or cloud)

## Environment Variables

Create a `.env` file in `/home/runner/work/Hospital-Food-Delivery-Management-System/Hospital-Food-Delivery-Management-System/backend`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Installation

### 1) Install backend dependencies

```bash
cd /home/runner/work/Hospital-Food-Delivery-Management-System/Hospital-Food-Delivery-Management-System/backend
npm install
```

### 2) Install frontend dependencies

```bash
cd /home/runner/work/Hospital-Food-Delivery-Management-System/Hospital-Food-Delivery-Management-System/frontend
npm install
```

## Running the Application

### Start backend

```bash
cd /home/runner/work/Hospital-Food-Delivery-Management-System/Hospital-Food-Delivery-Management-System/backend
npm run dev
```

or

```bash
npm start
```

Backend runs on `http://localhost:5000`.

### Start frontend

```bash
cd /home/runner/work/Hospital-Food-Delivery-Management-System/Hospital-Food-Delivery-Management-System/frontend
npm start
```

Frontend runs on `http://localhost:3000`.

## Main API Endpoints

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Patients
- `POST /patients`
- `GET /patients`
- `GET /patients/:id`
- `PUT /patients/:id`
- `DELETE /patients/:id`

### Deliveries
- `POST /deliveries`
- `GET /deliveries`
- `PUT /deliveries/:id`

### Users
- `GET /users/all-users`

## Default Roles

- `admin`
- `pantry`
- `delivery`

## Notes

- Frontend currently uses API base URL `http://localhost:5000` directly in components.
- Ensure backend is running before using the frontend login and dashboard flows.
