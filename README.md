# CRUD User Data RESTful API

This README.md file provides an overview of the application, stack, development preparation, and deployment steps for this CRUD User Data RESTful API.

## Table of Contents

- [Assumptions Made](#assumptions-made)
- [Application Overview](#application-overview)
- [Tech Stack](#tech-stack)
- [Application Structure](#application-structure)
- [Development Preparation](#development-preparation)

## Assumptions Made

- `id` is generated server-side when the user data is saved for the very first time. In this case, i used UUID(v4) for the ids.
- A unique constraint exists for the user's `email`.

## Application Overview

This application is a RESTful API designed to manage user data with the following endpoints:

- `GET /users`: Retrieve a list of all users.
- `GET /users/:id`: Retrieve a user by their ID.
- `POST /users`: Create a new user.
- `PUT /users/:id`: Update an existing user by ID.
- `DELETE /users/:id`: Delete a user by ID.

The data managed by the API includes:

- `id`: A unique identifier for the user (automatically generated).
- `name`: The user's full name.
- `email`: The user's email address (must be unique).
- `dateOfBirth`: The user's date of birth.

To view more details and to test the API, you can use the Postman workspace I have created. Import the following link into Postman to get a pre-configured set of requests for the API:

[Postman Workspace](https://www.postman.com/hugosset/workspace/hangry-backend-case-study)

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
├── handlers.ts   # Functions for handling business logic and user requests
├── db.ts         # Provides an client interface for interacting with the database
├── misc.ts       # Stores miscellaneous functions that can be utilized throughout the app
```

## Development Preparation

To set up the development environment, follow these steps:

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Setup local versions of the required environment variables, by using `.env.example` as a template.
4. Push any schema changes to the local SQLite database by running `npx prisma db push`. This also generates the Prisma Client for use.
5. Run the application in development mode (with auto-reload, but no type-checking) by using `npm run dev`.
