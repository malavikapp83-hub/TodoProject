# TodoProject

A full-stack Todo application built with **Django REST Framework** and **React**, featuring JWT authentication and a production deployment on Render.

## 🚀 Live Application

**Backend API:**
https://todoproject-h31f.onrender.com

## ✨ Features

* User authentication with JWT
* Access and refresh tokens
* Create tasks
* View personal tasks
* Edit tasks
* Mark tasks as completed
* Delete tasks
* User-specific task data
* Automatic access-token refresh
* Django REST Framework API
* React frontend
* PostgreSQL support for production
* Render deployment

## 🛠️ Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT
* PostgreSQL
* Gunicorn

### Frontend

* React
* JavaScript
* CSS
* Fetch API

### Deployment

* GitHub
* Render

## 📁 Project Structure

```text
TodoProject/
│
├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── ...
│
├── tasks/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md
```

## 🔐 Authentication

The application uses JWT authentication.

### Obtain tokens

```text
POST /api/token/
```

Request:

```json
{
    "username": "your_username",
    "password": "your_password"
}
```

The API returns an access token and refresh token.

### Refresh access token

```text
POST /api/token/refresh/
```

Request:

```json
{
    "refresh": "your_refresh_token"
}
```

## 📋 Task API

### Get tasks

```text
GET /api/tasks/
```

Requires authentication.

### Create a task

```text
POST /api/tasks/
```

Example:

```json
{
    "title": "Buy groceries"
}
```

### Update a task

```text
PATCH /api/tasks/<id>/
```

Example:

```json
{
    "is_completed": true
}
```

### Delete a task

```text
DELETE /api/tasks/<id>/
```

Requires authentication.

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/malavikapp83-hub/TodoProject.git
cd TodoProject
```

### 2. Create a virtual environment

Windows:

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

### 3. Install backend dependencies

```powershell
pip install -r requirements.txt
```

### 4. Run migrations

```powershell
python manage.py migrate
```

### 5. Start Django

```powershell
python manage.py runserver
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### 6. Start React

Open another terminal:

```powershell
cd frontend
npm install
npm start
```

The frontend will run at:

```text
http://localhost:3000
```

## 🔑 Environment Variables

For production, configure the required environment variables in Render.

Example:

```text
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=your-postgresql-database-url
FRONTEND_URL=your-frontend-url
```

Do not commit secret keys, passwords, database URLs, or `.env` files to GitHub.

## 🌐 Deployment

The backend is deployed on Render.

The deployment uses:

```text
Build Command:
pip install -r requirements.txt && python manage.py migrate
```

```text
Start Command:
gunicorn backend.wsgi:application
```

Every new commit pushed to the `main` branch can trigger a new deployment.

## 🧪 API Authentication

Protected endpoints require the access token in the request header:

```text
Authorization: Bearer <access_token>
```

The React application stores the authentication tokens locally and automatically attempts to refresh the access token when it expires.

## 📌 Future Improvements

* User registration
* Password reset
* Task search
* Task filtering
* Task priorities
* Due dates
* Better mobile responsiveness
* Improved UI/UX
* Automated tests
* CI/CD improvements

## 👩‍💻 Author

**Malavika**

Built as a full-stack web development project using Django REST Framework and React.
