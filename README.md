
# 🏋️ Gym Management System

A full-stack web application for managing gym operations such as member records, billing, notifications, supplements, and diet plans.

---

## 📦 Tech Stack

* **Frontend:** React
* **Backend:** Node.js with Express
* **Database:** Supabase

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/nikhilesh-git/FitTrack.git
cd FitTrack
```

---

### 2. **Setup Backend**

```bash
cd backend
npm install
```

#### Start Backend Server

```bash
nodemon app.js
```
* You will see the message "Server Running at http://localhost:3000/" 
---

### 3. **Setup Frontend**
#### Open new terminal and go to the folder /gym-management-system/
```bash
cd ../frontend
npm install
```

#### Start Frontend Server

```bash
npm start
```

---

## 📂 Folder Structure

```
gym-management-system/
│
├── frontend/       ← React JS frontend
└── backend/        ← Node.js + Express API
```

---

## ✅ Features

* Admin and Member login
* Member management
* Bill generation and view
* Fee reminders via notifications
* Supplement stock and diet plan control

---

## ✅ Login Details

* Admin Login:
  * Email: gnikhilesh.2005@gmail.com
  * Password: Nikhilesh@2005

* Member Login:
  * Email: writernikhilesh@gmail.com
  * Password: 1111

---

## 📌 Notes

* Uses `js-cookie` for token management.
* SQLite is used for simplicity (easy to switch to PostgreSQL/MySQL).
* Basic role-based access handled in frontend and backend.

