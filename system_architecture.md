# MedCore HMS System Architecture

This document describes the system architecture for the MedCore Hospital Management System (HMS), which is built on the MERN stack (MongoDB, Express.js, React, Node.js) with Python integration for AI-powered disease prediction.

## 1. High-Level Architecture Overview

The system follows a standard client-server architecture:

- **Client Tier (Frontend):** A Single Page Application (SPA) built with React to handle UI and user interactions.
- **Application Tier (Backend):** A RESTful API built with Node.js and Express.js that acts as the bridge between the frontend and the database. It also integrates with a Python AI engine.
- **Data Tier (Database):** A MongoDB database to store all application data.

## 2. Frontend Architecture (React)

**Location:** `frontend/` directory

### Technology Stack

- **Framework:** React 18+
- **Routing:** React Router DOM
- **State Management:** React Context API (e.g., `AuthContext` for authentication state)
- **Styling:** CSS natively (`index.css` and component-level CSS)
- **HTTP Client:** Axios (`api/client.js`)
- **Notifications/Alerts:** `react-hot-toast`, `sweetalert2`

### Key Folders

- `src/components/`: Reusable UI components (buttons, modals, tables, layout components).
- `src/pages/`: Main views corresponding to routes (e.g., `AdmissionsPage.jsx`, `Login.jsx`, `AIDiseaseFinder.jsx`).
- `src/context/`: Global state providers.
- `src/api/`: Centralized API client config and endpoint functions.

## 3. Backend Architecture (Node.js & Express)

**Location:** `backend-node/` directory

### Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Mongoose (MongoDB)
- **Authentication:** JSON Web Tokens (JWT)
- **File Output:** `pdfkit` for generating invoices and reports
- **AI Integration:** Python child processes to run AI scripts

### Key Folders & Modules

- `models/`: Mongoose schemas defining the data structure.
  - `User.js`: Base users with roles (Admin, Doctor, Receptionist, Patient).
  - `PatientProfile.js` / `DoctorProfile.js`: Role-specific profile details.
  - `Admission.js` / `Room.js` / `Department.js`: Facilities and patient accommodation.
  - `Appointment.js`: Managing clinic visits.
  - `Prescription.js` / `Medicine.js` / `PharmacyOrder.js`: Pharmacy management.
  - `Invoice.js`: Billing and payments.
- `controllers/`: Business logic corresponding to each route (e.g., `appointmentController.js`, `departmentController.js`).
- `routes/`: Express route definitions connecting endpoints to controllers.
- `ai_engine/`: Python scripts (e.g., `disease_finder.py`) invoked by Node.js for ML inferences.

## 4. Integration & Data Flow

1. **Authentication Flow:** Users log in via the React frontend. The Node.js backend verifies credentials and issues a JWT. The frontend stores this token and sends it in the `Authorization` header via the Axios client for protected routes.
2. **Standard Crud Flow:**
   - User interacts with React UI.
   - Axios sends HTTP request (GET, POST, PUT, DELETE) to Express route.
   - Express route passes request to the corresponding Controller.
   - Controller queries MongoDB using Mongoose Models.
   - Controller sends JSON response back to Frontend.
   - React updates the DOM based on response.
3. **AI Prediction Flow:**
   - Frontend sends symptoms to a dedicated AI backend endpoint.
   - Node controller spawns a Python process running `disease_finder.py`.
   - The Python script calculates predictions and returns them via standard output.
   - Node parses the output and responds to the frontend.
4. **Report Generation Flow:**
   - Frontend requests a bill download.
   - Backend queries database, generates a PDF pipeline using `pdfkit`, and streams the PDF directly in the HTTP response (`application/pdf`).

## 5. Security & Roles

The system uses Role-Based Access Control (RBAC).

- Typical roles: `admin`, `receptionist`, `doctor`, `patient`.
- Frontend conditionally renders elements (like the "Admit Patient" button) based on the user's role.
- Backend routes use middleware to verify the JWT and check if the user's role has permission to perform the requested action.
