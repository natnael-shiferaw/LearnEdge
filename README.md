# LearnEdge

> **LearnEdge** is a full-stack learning management platform where instructors can publish courses and students can purchase, view, and track their progress.

---

## 🚀 Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Screenshots](#screenshots)  
4. [Architecture](#architecture)  
5. [Getting Started](#getting-started)  
6. [Folder Structure](#folder-structure)  
7. [Pages & Routes](#pages--routes)  
   - [Public](#public)  
   - [Student View](#student-view)  
   - [Instructor View](#instructor-view)  
8. [Environment Variables](#environment-variables)  
9. [License](#license)  

---

## 📝 Overview

LearnEdge empowers learners worldwide with high-quality, instructor-led courses on development, data science, business, and more.

---

## ✨ Features

- **Public pages**: Home, Courses catalog, Categories, Course detail, Auth (Sign up / Sign in)  
- **Student view**: Dashboard, My Courses list, Lecture-by-lecture Progress tracker  
- **Instructor view**: Dashboard stats, Course CRUD (+ add-course dialog), Student roster  
- **Dark/light theme** toggle  
- **Real-time progress tracking** stored in MongoDB  
- **Responsive UI** with Radix & shadcn/ui components  

---

## 🖼 Screenshots

### Home Page
*The landing page highlights platform features and a call-to-action for new users.*  
![image](https://github.com/user-attachments/assets/5d134444-3832-488d-8fe4-dc9c77525597)

### Courses Catalog
*Browse and filter through all available courses in one place.*  
![image](https://github.com/user-attachments/assets/fbe1ce3d-5d50-41ff-aa4b-1b8a00fbbd10)

### Categories
*Explore courses by category, each showing number of available courses.*  
![image](https://github.com/user-attachments/assets/cac0cb4a-e220-4ec9-8bf1-efef137b7070)

### Course Details
*Detailed view of individual course: syllabus, instructor bio, ratings.*  
![image](https://github.com/user-attachments/assets/c402c50b-4b19-4f3f-ad68-08b2acc902f7)

### Authentication
*Unified Sign Up / Sign In flow for both students and instructors.*  
![image](https://github.com/user-attachments/assets/f77c8cc9-9f8a-4484-bcc0-a627b24bd7d4)

### Student Dashboard
*Overview of enrolled courses, progress, certificates, and recommendations.*  
![image](https://github.com/user-attachments/assets/8aad0613-d4ef-4af7-a205-16e6581aa2ae)

### My Courses
*List of purchased courses with resume progress buttons.*  
![image](https://github.com/user-attachments/assets/8cde63dc-a548-4757-bf1c-18c02c541583)

### Course Progress
*Video player and progress tracker for each lecture in a course.*  
![image](https://github.com/user-attachments/assets/aa55679b-4ffe-4678-9846-9efdaeff0ccf)

### Instructor Dashboard
*High-level stats on students, revenue, courses, and ratings.*  
![image](https://github.com/user-attachments/assets/2889268f-c8a4-4e4f-85a3-b1f5003bbed1)

### Instructor Courses (CRUD)
*Manage, edit, delete, and view performance for your courses.*  
![image](https://github.com/user-attachments/assets/d8b6376f-a9b6-4f7d-b8a0-ae1e1eba2fc7)

### Add Course Dialog
*Modal form for creating new courses with structured fields.*  
![image](https://github.com/user-attachments/assets/0808daac-8bd3-4753-a0f7-2928f4f5fc57)

### Instructor Students
*Table of all students enrolled in your courses with contact info.*  
![image](https://github.com/user-attachments/assets/5a2cf52d-d0d5-4174-8d4c-d86d08b4c341)

---

## 🏗 Architecture

- **Frontend**: React 19 + Vite, Tailwind CSS, Radix UI, Axios  
- **Backend**: Node.js + Express 5, MongoDB (Mongoose), Cloudinary, PayPal SDK  
- **Authentication**: JWT-based, protected routes for student/instructor  
- **Hosting**: Frontend on Vercel, Backend on Render  

---

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/learnedge.git
cd learnedge
```

### 2. Backend setup

```bash
cd backend
npm install
npm run dev   # or `npm start` for production
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev   # starts Vite development server
```

Your frontend will run at `http://localhost:5173`, backend at `http://localhost:5000`.

---

## 📁 Folder Structure

```
├── backend/
│   ├── controllers/
│   ├── helpers/
|   ├── middleware
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   │   ├── home/
    │   │   ├── courses/
    │   │   ├── categories/
    │   │   ├── student/…
    │   │   └── instructor/…
    │   ├── context/
    │   ├── services/
    │   ├── hooks/
    │   ├── App.jsx
    │   └── index.jsx
    ├── .env
    └── package.json
```

---

## 🌐 Pages & Routes

### Public
| Route                 | Component                       |
|-----------------------|---------------------------------|
| `/` or `/home`        | HomePage                        |
| `/courses`            | CoursesPage                     |
| `/courses/:id`        | CourseDetailPage                |
| `/categories`         | CategoriesPage                  |
| `/categories/:slug`   | CategoryPage                    |
| `/auth`               | AuthPage (Sign Up / Sign In)    |

### Student View
| Route                                    | Component                          |
|------------------------------------------|------------------------------------|
| `/student` or `/student/dashboard`       | StudentDashboardPage               |
| `/student/my-courses`                    | MyCoursesPage                      |
| `/student/my-courses/course-progress/:id`| CourseProgressPage                 |

### Instructor View
| Route                       | Component                          |
|-----------------------------|------------------------------------|
| `/instructor`               | InstructorDashboardPage            |
| `/instructor/courses`       | InstructorCoursesPage (CRUD)       |
| `/instructor/students`      | InstructorStudentsPage             |

---

## 🔧 Environment Variables

### backend/.env
```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
PAYPAL_CLIENT_ID=…
PAYPAL_SECRET_ID=…
```

### frontend/.env
```
VITE_BACKEND_URL=http://localhost:5000/
```

---

## 📜 License

MIT © [Natnael Shiferaw](https://github.com/natnael-shiferaw)

---

 
