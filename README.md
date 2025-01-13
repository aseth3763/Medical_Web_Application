# Medical Web Application

## Description
A comprehensive medical web application designed to streamline staff, appointment, and patient management efficiently. This backend solution supports admin and staff functionalities, appointment scheduling, patient record management, and diagnostic reports handling.

## Features
- Admin and staff login and password management
- Patient registration and management
- Appointment scheduling and availability slots
- Diagnostic reports management
- Billing and payment status tracking
- Role-based access control

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **File Uploads**: Multer
- **Other Libraries**: Nodemailer, bcrypt

## Folder Structure
```
project-kick_off/
project-kick_off/
├── controllers/    // Handles logic for routes
├── routes/         // API route definitions
├── models/         // Database schemas
├── middleware/     // Custom middlewares
├── utils/          // Helper functions
├── .env            // Environment configuration
├── package.json    // Project metadata
└── index.js        // Application entry point

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or later)
- MongoDB (local or cloud-based instance)
- Git

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/medical_web_app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd medical_web_app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the root directory and add the following:
     ```env
     DB_URL=<Your MongoDB URL>
     EMAIL_USER=<Your Email Address>
     EMAIL_PASS=<Your Email Password>
     ```

5. Start the application:
   ```bash
   npm start
   ```

## API Documentation

### Admin Routes
- `GET /getAdminDetail`: Fetch admin details.
- `POST /login`: Admin login.
- `POST /addUserStaffData`: Add staff data.
- `GET /getUserStaffById/:id`: Fetch staff details by ID.

### User Routes
- `POST /appointmentRegister/:doctorId`: Register an appointment.
- `POST /patientRegister`: Register a new patient.
- `GET /getAllPatientList`: Get a list of all patients.
- `POST /addDoctorData`: Add doctor data.

### Form Routes
- `POST /createRiskAssessment/:patientId`: Create a risk assessment form.
- `GET /getRiskAssessments`: Fetch all risk assessments.
- `POST /createDisclosureForm/:patientId`: Create a disclosure form.

(Expand further as needed for other routes.)

## Environment Variables

Provide the following in a `.env` file:
```env
PORT=6600
Mongo_Db=mongodb+srv://<username>:<password>@cluster0.ro8e4sn.mongodb.net/medical_web
# Mongo_Db_local=mongodb://localhost:27017/MedicalWeb

smtp_email=<your-smtp-email>
smtp_pass=<your-smtp-password>

username=<your-username>
password=<your-password>


## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

