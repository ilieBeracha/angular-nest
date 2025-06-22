# Angular-NestJS Fullstack Application

This repository contains a fullstack application with an Angular frontend and a NestJS backend.

## Project Structure

- `angular-dashboard/` - Angular frontend application
- `server/` - NestJS backend application

## Running the Frontend (Angular)

### Option 1: Using locally installed Angular CLI (Recommended)

The Angular CLI is already installed as a local dependency in the angular-dashboard directory. To use it:

```bash
# Navigate to the Angular project directory
cd angular-dashboard

# Start the development server
npm run start
# or
npm run ng serve
```

### Option 2: Install Angular CLI globally

If you prefer to use the Angular CLI globally:

```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Then you can run ng commands from anywhere
cd angular-dashboard
ng serve
```

## Running the Backend (NestJS)

```bash
# Navigate to the server directory
cd server

# Install dependencies (if not already done)
npm install

# Start the development server
npm run start
# or for development with auto-reload
npm run start:dev
```

## Development

For the best development experience, you'll need to run both the frontend and backend servers simultaneously. You can do this by opening two terminal windows, one for each server.
