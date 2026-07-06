# ExamPro - Online Examination System

A secure, production-grade, and beautifully styled full-stack web application designed for administering academic and certification tests. Built with a modern **React.js** frontend and a robust **Spring Boot (Java 17)** backend backed by **MySQL**.

---

## Technical Stack

*   **Frontend:** React.js, React Router DOM, Axios, Lucide React (for UI Icons), Custom HSL Styling (Glassmorphism layout)
*   **Backend:** Spring Boot 3.x, Spring MVC, Spring Data JPA, Hibernate, Spring Security, JWT (HMAC-SHA256), Maven
*   **Database:** MySQL 8.x

---

## Directory Structure

```
exampro/
├── README.md
├── schema.sql
├── sample-data.sql
├── exampro_postman_collection.json
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/exampro/
│           │   ├── ExamProApplication.java
│           │   ├── config/          # Spring Security, CORS, Web Config
│           │   ├── controller/      # REST API Controllers
│           │   ├── dto/             # Request/Response payloads
│           │   ├── entity/          # JPA Models
│           │   ├── exception/       # Exception Handling
│           │   ├── repository/      # JPA Repositories
│           │   ├── security/        # JWT Authentication Engine
│           │   └── service/         # Business Logic Layer
│           └── resources/
│               └── application.properties
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── index.css                # Glassmorphic Blue Theme styling
        ├── main.jsx
        ├── App.jsx
        ├── components/              # Navbar, Sidebar Shell
        ├── context/                 # AuthContext
        ├── hooks/                   # useFullscreen, useVisibility
        ├── pages/                   # Landing, Login, Registers, Dashboards, CRUD
        └── services/                # Axios Client Instance
```

---

## Installation & Setup Instructions

### 1. Database Configuration
1. Start your local MySQL Server.
2. Log into the MySQL console and run the database schema initialization script:
   ```sql
   SOURCE C:/Users/ugesh/.gemini/antigravity/scratch/exampro/schema.sql;
   ```
3. Load the sample testing datasets (pre-populates 3 users, 3 exams, questions, options, and score logs):
   ```sql
   SOURCE C:/Users/ugesh/.gemini/antigravity/scratch/exampro/sample-data.sql;
   ```

### 2. Backend Setup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Verify database connection credentials in `src/main/resources/application.properties` (username: `root`, password: `root`).
3. Build and package the project:
   ```bash
   mvn clean install
   ```
4. Start the application container:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will run on port `8080`.*

### 3. Frontend Setup (React.js)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
   *The React UI console will launch on port `3000`.*

---

## Default Login Credentials (Pre-Seeded)

For testing purposes, the following credentials are pre-hashed and active in the database:

### Administrator Account
*   **Email:** `admin@exampro.com`
*   **Password:** `admin123`

### Student Account
*   **Email:** `student@exampro.com`
*   **Password:** `admin123`

---

## Advanced Proctoring Engine Features

The exam-taking console (`TakeExam.jsx`) enforces standard browser security rules:
*   **Mandatory Fullscreen:** If the candidate declines or exits fullscreen, warning banners are shown. Exiting twice causes automatic submission.
*   **Visibility Interceptor:** Uses Page Visibility and blur events to count tab switching. 3 switches trigger auto-submission.
*   **Input Blocking:** Prevents right-click (`contextmenu`), text highlights (`selectstart`), drag-and-drop, and copy-paste.
*   **Shortcut Blacklist:** Intercepts key combos (e.g. `Ctrl+C`, `Ctrl+V`, `Ctrl+X`, `Ctrl+A`, `Ctrl+S`, `Ctrl+P`, `F12`, `Ctrl+Shift+I`) and cancels browser defaults.
*   **Auto-Submit:** Saved answers submit immediately when the timer countdown reaches `00:00`.
