# Expense Tracker
![Screenshot 2025-03-16 181535](https://github.com/user-attachments/assets/c57316ad-d49e-4520-a9f4-1a7dd9ded71e)

## 📌 Project Overview
The **Expense Tracker** is a full-stack web application that allows users to track their daily expenses. Users can add, view, and delete their expenses with authentication support.

## 🔥 Features
- User authentication (Login/Signup with JWT)
- Add expenses with category, description, amount, and date
- View and filter expense list
- Delete expenses securely
- Responsive UI built with React & TailwindCSS
- Backend API with Express.js and PostgreSQL

## 🛠️ Tech Stack
### Frontend:
- React.js (with TypeScript)
- Tailwind CSS
- Axios for API requests

### Backend:
- Node.js with Express.js
- PostgreSQL (Database)
- Drizzle ORM
- JSON Web Tokens (JWT) for authentication

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Bikash-sharma-5/Expense-_Tracker.git
cd Expense-_Tracker
```

### 2️⃣ Install Dependencies
#### Frontend:
```sh
cd client
npm install
```

#### Backend:
```sh
cd server
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the `server` directory with the following:
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Project
#### Start Backend Server:
```sh
cd server
npm run dev
```

#### Start Frontend:
```sh
cd client
npm start
```

### 5️⃣ Open the App
Visit `http://localhost:3000` in your browser.

## 🔄 API Endpoints
| Method | Endpoint              | Description            |
|--------|----------------------|------------------------|
| POST   | `/api/auth/signup`   | User Signup           |
| POST   | `/api/auth/login`    | User Login            |
| GET    | `/api/expenses`      | Get all expenses      |
| POST   | `/api/expenses`      | Add new expense       |
| DELETE | `/api/expenses/:id` | Delete an expense     |

## 🐞 Troubleshooting
### ❌ Expense Delete Error (404 Not Found)
- Ensure the `expenseId` is correctly passed.
- Make sure the authenticated user owns the expense before deletion.
- Check if the backend correctly verifies and processes the request.

### ❌ Git Push Rejected
If your push is rejected, run:
```sh
git pull origin main --rebase
git push origin main
```

## 🤝 Contributing
Feel free to fork the repo and submit a pull request with improvements!

## 📜 License
This project is open-source under the MIT License.

