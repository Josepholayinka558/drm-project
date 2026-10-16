# Departmental Resource Manager (DRM)

A university-level project system used to manage and book departmental resources such as lecture rooms, laboratories, and equipment.

## Tech Stack
- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Auth**: JWT, bcryptjs

## Prerequisites
- Node.js installed
- MySQL Server installed and running

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or terminal).
2. Create the database and tables using the provided SQL script:
   ```sql
   -- Run the content of drm_db.sql
   ```
   Or via command line:
   ```bash
   mysql -u root -p < drm_db.sql
   ```

### 2. Backend Configuration
1. Clone or download the project files.
2. Navigate to the project root:
   ```bash
   cd drm-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Rename `.env.example` to `.env`.
   - Update `DB_USER`, `DB_PASS`, and `JWT_SECRET` with your local settings.

### 3. Run the Application
1. Start the server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

### 4. Access the UI
- Open your browser and go to `http://localhost:3000`.
- You can register a new account or use the default admin if you've added it to the DB.

## Features
- **Authentication**: Secure registration and login with JWT.
- **RBAC**: Admin, Staff, and Student roles.
- **Resource Management**: Admins can add/edit/delete resources.
- **Booking**: Users can book resources with real-time conflict detection.
- **Approval System**: Admins can approve or reject booking requests.
- **Dashboard**: Modern UI with usage stats and history.

## Project Structure
- `/client`: Frontend HTML, CSS, and JS.
- `/server`: Backend API with MVC architecture.
- `/config`: Database connection logic.
- `drm_db.sql`: Database schema.
