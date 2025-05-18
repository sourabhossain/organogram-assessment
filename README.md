# Organogram Management System

Organogram Management System is a full-stack application for managing company roles and employees in a hierarchical structure. It features a NestJS backend with MySQL, JWT authentication, and a Bootstrap-based admin panel.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [API Overview](#api-overview)
- [Frontend Usage](#frontend-usage)

---

## Features

- Manage Positions with parent-child relationships (organogram tree)
- Manage Employees linked to Positions
- Retrieve employees recursively under any position
- JWT Authentication and Authorization
- OpenAPI (Swagger) docs available at `/api-docs`
- Bootstrap UI for admin management

---

## Prerequisites

- Node.js >= 22.x
- yarn
- MySQL
- Git

---

## Installation

1. Clone the repository

```bash
git clone git@github.com:sourabhossain/organogram-assessment.git
cd organogram-assessment
```

2. Install dependencies

```bash
yarn install
```

---

## Configuration

1. Copy `.env.example` to `.env` and update environment variables accordingly:

<details>
<summary>.env Configuration</summary>

```env
#############################################
#           Server Configuration            #
#############################################

HOST=localhost
PORT=8000

#############################################
#           Database Configuration          #
#############################################

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=organogram
SYNCHRONIZE=true

#############################################
#           JWT Authentication              #
#############################################

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=3600s
```

</details>

2. Create the database in MySQL:

```bash
CREATE DATABASE organogram;
```

---

## Running the Project

Start the development server:

```bash
yarn start:dev
```

The backend server will run at:  
[http://localhost:8000](http://localhost:8000)

---

## Database Seeding

To seed the database with initial roles, positions, employees, and users, run:

```bash
yarn seed
```

This creates:

- **Roles**: Admin, Manager, User
- **Positions**: CTO > Senior Software Engineer > Software Engineer
- **Users**:
    - `alice` (Roles: Admin, Manager) — password: `password123`
    - `bob` (Role: User) — password: `password123`

---

## API Documentation

Swagger UI is available at:

```
http://localhost:8000/api-docs/
```

Use this to explore all API endpoints, try requests, and view schemas.

---

## API Overview

- `POST /auth/login` — Login and receive JWT token
    - Include token in headers as:  
      `Authorization: Bearer <your_token>`
- `GET /positions` — List all positions
- `POST /positions` — Create a new position
- `GET /employees` — List all employees
- `POST /employees` — Create a new employee
- `GET /positions/:id/employees` — Get all employees under a position recursively

---

## Frontend Usage

The frontend UI is served as static files under `/public`.
Open `index.html` in your browser or run a static server pointing to `/public`.

Features:

- Login form to authenticate
- Tabs to manage positions, employees, and view subordinates
- Logout button to clear session

Make sure your backend server is running and accessible at `http://localhost:8000`.
