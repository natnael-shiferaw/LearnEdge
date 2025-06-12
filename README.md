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
Students can browse, purchase, and track progress through an intuitive React/Vite frontend. Instructors manage courses and students via an Express/Node backend.

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
![image](https://github.com/user-attachments/assets/5d134444-3832-488d-8fe4-dc9c77525597)


### Courses Catalog  
![image](https://github.com/user-attachments/assets/fbe1ce3d-5d50-41ff-aa4b-1b8a00fbbd10)


### Categories  
![image](https://github.com/user-attachments/assets/cac0cb4a-e220-4ec9-8bf1-efef137b7070)


### Course Details  
![image](https://github.com/user-attachments/assets/c402c50b-4b19-4f3f-ad68-08b2acc902f7)


### Authentication  
![image](https://github.com/user-attachments/assets/f77c8cc9-9f8a-4484-bcc0-a627b24bd7d4)


### Student Dashboard  
![image](https://github.com/user-attachments/assets/8aad0613-d4ef-4af7-a205-16e6581aa2ae)


### My Courses  
![image](https://github.com/user-attachments/assets/8cde63dc-a548-4757-bf1c-18c02c541583)


### Course Progress  
![image](https://github.com/user-attachments/assets/aa55679b-4ffe-4678-9846-9efdaeff0ccf)


### Instructor Dashboard  
![image](https://github.com/user-attachments/assets/2889268f-c8a4-4e4f-85a3-b1f5003bbed1)


### Instructor Courses (CRUD)  
![image](https://github.com/user-attachments/assets/d8b6376f-a9b6-4f7d-b8a0-ae1e1eba2fc7)


### Add Course Dialog  
![image](https://github.com/user-attachments/assets/0808daac-8bd3-4753-a0f7-2928f4f5fc57)


### Instructor Students  
![image](https://github.com/user-attachments/assets/5a2cf52d-d0d5-4174-8d4c-d86d08b4c341)


---

## 🏗 Architecture

- **Frontend**: React 19 + Vite, Tailwind CSS,Shadcn UI, Axios  
- **Backend**: Node.js + Express, MongoDB (Mongoose), Cloudinary, PayPal SDK  
- **Authentication**: JWT-based, protected routes for student/instructor  
- **Hosting**: Frontend on Vercel, Backend on Render  

---

## 🏁 Getting Started

### Prerequisites

- Node.js v18+  
- npm or yarn  
- MongoDB URI  
- Cloudinary account (for media uploads)  
- PayPal API credentials  

### Local Setup

1. **Clone repository**  
   ```bash
   git clone https://github.com/natnael-shiferaw/learnedge.git
   cd learnedge
