# Personal Finance Tracker

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)

> A full-stack personal finance application for recording income and expenses, viewing a live balance summary, and filtering transactions by date and category, with secure per-user accounts.

---

## 📌 Overview

Personal Finance Tracker is a web application that helps individuals keep track of their money in one place. Users create an account, log in, and record income and expense transactions under predefined categories. The dashboard shows total income, total expense, and the current balance, and transactions can be filtered by date range or category.

The project is built as a student portfolio application. It consists of a Node.js/Express REST API backed by MongoDB and a lightweight frontend built with HTML, Bootstrap, and vanilla JavaScript.

---

## ✨ Key Features

- **User registration and login** with hashed passwords
- **JWT-based authentication** with protected API routes (tokens expire after 1 hour)
- **User-specific data**: every transaction is tied to the logged-in user and only that user's data is returned
- **Add and delete transactions** (income or expense) with amount, type, and category
- **Predefined categories**: Salary, Food, Rent, Transport, Shopping, Entertainment, Bills, Other
- **Financial summary cards** showing Total Income, Total Expense, and Balance (₹)
- **Filtering** by custom date range, by category, or with quick *This Month* / *Last Month* shortcuts
- **Collapsible filter panel** with a status label showing the active filter
- **Dark mode** with the preference saved in the browser
- **Responsive UI** built with Bootstrap 5, with a loading spinner, delete confirmation, and password show/hide toggle
- **Client-side validation** on registration (required fields, email format, minimum 6-character password)

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (vanilla), Bootstrap 5.3.2, Bootstrap Icons 1.10.0 (via CDN) |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose 9 |
| Authentication | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| Other Libraries | `cors` |
| Tools | Git, GitHub, VS Code (Live Server) |

---

## 📁 Project Structure

```text
Finance-Tracker/
├── frontend/
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   └── Tracker.html      # Main dashboard (transactions, summary, filters)
├── backend/
│   ├── server.js         # Express server, models, auth middleware, and API routes
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

---

## 🔄 Application Workflow

1. A new user registers with name, email, and password.
2. The password is hashed with bcrypt and the user is stored in MongoDB.
3. The user logs in and receives a JWT, which the frontend stores in `localStorage`.
4. The dashboard (`Tracker.html`) redirects to the login page if no token is found.
5. The user adds income or expense transactions, which are saved against their user ID.
6. The dashboard fetches that user's transactions, newest first, and calculates total income, total expense, and balance.
7. The user can apply date and category filters, toggle dark mode, delete transactions, or log out.

---

## 🔐 Authentication & Security

- **Password hashing:** passwords are hashed with `bcryptjs` (10 salt rounds) before being stored.
- **JWT authentication:** on successful login the server issues a signed token that expires in 1 hour.
- **Protected routes:** an Express middleware reads the token from the `Authorization` header and rejects requests with a missing or invalid token.
- **Data isolation:** transactions are saved with the authenticated user's ID, and fetching and deleting are scoped to that user.
- **Password exclusion:** the `/me` endpoint omits the password hash from its response.

> **Note:** This is a learning project and is not hardened for production. The JWT secret, database URL, and port are currently hardcoded in `server.js`, CORS allows all origins, and the API does not yet perform server-side input validation. See [Future Improvements](#-future-improvements).

---

## 🔌 API Endpoints

The backend runs on `http://127.0.0.1:5000`.

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Authenticate a user and return a JWT |
| GET | `/me` | Yes | Get the authenticated user's profile (without password) |
| POST | `/add` | Yes | Add a new transaction |
| GET | `/transactions` | Yes | Get the user's transactions, with optional `start`, `end`, and `category` query parameters |
| DELETE | `/delete/:id` | Yes | Delete one of the user's transactions |

Protected routes expect the token in the `Authorization` header.

---

## 🚀 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on the default port (`27017`)

### 1. Clone the repository

```bash
git clone https://github.com/Arunkumar-9/Finance-Tracker.git
cd Finance-Tracker
```

### 2. Start the backend

```bash
cd backend
npm install
node server.js
```

The server starts on `http://127.0.0.1:5000` and connects to a local MongoDB database named `financeDB`, which is created automatically on first use.

### 3. Run the frontend

The frontend is a set of static HTML files and does not need a build step. Either:

- Open `frontend/login.html` in your browser, or
- Use the VS Code **Live Server** extension on the `frontend/` folder (the repository's VS Code settings use port `5501`).

Register a new account, log in, and start adding transactions.

---

## ⚙️ Environment Variables

The project does **not** currently read a `.env` file. The following values are hardcoded in `backend/server.js`:

| Value | Current setting |
|---|---|
| MongoDB connection | `mongodb://127.0.0.1:27017/financeDB` |
| Server port | `5000` |
| JWT secret | Hardcoded string |

For any deployment, these should be moved to environment variables. A recommended `.env` layout (`.env` is already listed in `.gitignore`):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🖼️ Screenshots

<!-- Add screenshots here, for example:
![Login Page](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
-->

*Screenshots coming soon.*

---

## 🔮 Future Improvements

These are planned ideas and are **not** part of the current implementation:

- Move secrets and configuration to environment variables
- Server-side input validation and stricter CORS configuration
- Charts for spending by category and monthly trends
- Budget limits per category
- Export reports (CSV/PDF)
- Edit existing transactions
- Recurring transactions
- Deployment of the frontend and backend

---

## 📚 Project Highlights

This project demonstrates practical skills in:

- Full-stack development with a separate frontend and REST API
- Designing and consuming REST endpoints (CRUD operations)
- JWT authentication, password hashing, and protected routes
- MongoDB integration with Mongoose schemas and queries
- Query filtering by date range and category
- Frontend-backend integration using the Fetch API
- Responsive UI development with Bootstrap and theme persistence

---

## 👤 Author

**Arun Kumar Boina**

- GitHub: [github.com/Arunkumar-9](https://github.com/Arunkumar-9)
- LinkedIn: [linkedin.com/in/arun-kumar-boina-5908b9310](https://www.linkedin.com/in/arun-kumar-boina-5908b9310/)
