# CRUD User Data RESTful API

This README.md file provides an overview of the application, stack, development preparation, and deployment steps for this CRUD User Data RESTful API.

## Table of Contents

- [Assumptions Made](#assumptions-made)
- [Application Overview](#application-overview)
- [Tech Stack](#tech-stack)
- [Application Structure](#application-structure)
- [Development Preparation](#development-preparation)

## Assumptions Made

- **ID Generation**: User IDs are generated server-side. In this case, i am using UUIDs for the user's IDs.
- **Email Uniqueness**: Each user's email address must be unique across the system.

## Application Overview

This application is a RESTful API designed to manage user data with the following endpoints:

- `GET /users`: Retrieve a list of all users.
- `GET /users/:id`: Retrieve a user by their ID.
- `POST /users`: Create a new user.
- `PUT /users/:id`: Update an existing user by ID.
- `DELETE /users/:id`: Delete a user by ID.

The data managed by the API includes:

- `id` (string): A unique identifier for the user (automatically generated).
- `name` (string): The user's full name.
- `email` (string): The user's email address (must be unique).
- `dateOfBirth` (Date): The user's date of birth.

To view more details and to test the API, you can use the Postman collection I have created. Open the following link to view some API documentation and get a pre-configured set of requests for the API:

[Postman Documentation & Requests](https://www.postman.com/hugosset/workspace/hangry-backend-case-study/documentation/23397272-bbc5f628-5714-4048-b229-fc7978629858)

## Tech Stack

The backend is built using the following technologies:

- **Node.js**: JavaScript runtime environment.
- **TypeScript**: Superset of JavaScript with type safety
- **Prisma ORM**: Next-generation type-safe Object-Relational Mapper (ORM)

## Application Structure

The application follows the following structure:
```
/src
├── index.ts      # Main entry point of the application
├── routes.ts     # Route definitions and handlers
├── handlers.ts   # Business logic and user request handlers
├── db.ts         # Database client interface (Prisma)
└── misc.ts       # Miscellaneous utility functions
```

## Development Preparation

To set up the development environment, follow these steps:

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Setup local versions of the required environment variables into `.env`, by using `.env.example` as a template.
4. Push any schema changes to the local SQLite database by running `npx prisma db push`. This also generates and prepares the Prisma Client for use.
5. Run the application in development mode (with auto-reload, but no type-checking) by using `npm run dev`.
