import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export function Dashboard({ setIsAuthenticated} ) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expenseDistribution, setExpenseDistribution] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate(); // Use navigate at the top level of the component
  useEffect(() => {
    // Check for the auth token in localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      // If no token, navigate to the login page
      navigate('/login');
    } else {
      // You can also add logic to check if the token is still valid here (optional)
    }
  }, [navigate]); // Th
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:5000/api/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(response.data);

      // Calculate the expense distribution by counting expenses in each category
      const categoryDistribution = response.data.reduce((acc: any, expense: Expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += 1; // Increment count for the category
        return acc;
      }, {});

      // Log the category distribution for debugging
      console.log('Category Distribution:', categoryDistribution);

      // Prepare data for Pie Chart
      const pieData = Object.keys(categoryDistribution).map((category) => ({
        name: category,
        value: categoryDistribution[category], // Use count instead of amount
      }));

      setExpenseDistribution(pieData);
      console.log('Expense Distribution Data for Pie:', pieData);  // Log pie data

      setLoading(false);
    } catch (error: any) {
      setError('Error fetching expenses or no token found.');
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center mt-10">Loading your expenses...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <button onClick={handleSignOut} className="flex items-center space-x-2 p-2 bg-blue-600 text-white rounded">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <ExpenseForm onExpenseAdded={fetchData} />

            <h2 className="text-xl font-semibold mt-8 mb-4">Recent Expenses</h2>
            <ExpenseList expenses={expenses} onExpenseDeleted={fetchData} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Expense Distribution</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={expenseDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {expenseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRandomColor()} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
