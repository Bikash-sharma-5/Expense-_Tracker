const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL Connection Setup
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'expense_tracker',
    password: process.env.POSTGRES_PASSWORD || 'mysecretpassword',
    port: Number(process.env.POSTGRES_PORT) || 5432,
});

// JWT Secret Key
const JWT_SECRET = 'your_jwt_secret';

// Middleware for checking JWT
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Add the user info to the request
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

// User Registration (Controller)
const registerUser = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        console.log("User created:", result.rows[0]); // Log the created user
        res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
        console.error("Error registering user:", error); // Log the error
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};


// User Login (Controller)
const loginUser = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Get Expenses (Controller)
const getExpenses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [req.user.userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};

// Add Expense (Controller)
const addExpense = async (req, res) => {
    const {  description, amount,category } = req.body;

    // Check if category is provided
    if (!description || !amount || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      

    // Proceed with adding the expense
    try {
        const result = await pool.query(
            'INSERT INTO expenses (user_id, description, amount, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.userId, description, amount, category] // Pass category in the query
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding expense', error });
    }
};
app.delete('/api/expenses/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    console.log("Received DELETE request. Params:", req.params);
    console.log("Expense ID requested for deletion:", id);
    console.log("Authenticated User ID:", req.user.userId);

    try {
        const result = await pool.query(
            'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *;', 
            [id, req.user.userId]
        );

        if (result.rowCount === 0) {
            console.log("Expense not found or doesn't belong to user.");
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        console.log("Expense deleted:", result.rows[0]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Routes Setup
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/expenses', authMiddleware, getExpenses);
app.post('/api/expenses', authMiddleware, addExpense);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
