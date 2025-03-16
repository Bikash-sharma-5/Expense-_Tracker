import React from "react";
import { format } from "date-fns";

import { Trash2 } from "lucide-react";
import axios from 'axios';
interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

export function ExpenseList({ expenses, onExpenseDeleted }: ExpenseListProps) {
  const handleDelete = async (expenseId: string) => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('No token found. User is not authenticated.');
            return;
        }

        console.log("Auth Token:", token);
        console.log("Deleting expense with ID:", expenseId);

        await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Expense deleted successfully');
        onExpenseDeleted(); // Refresh list
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
};

 

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {expenses.map((expense) => (
          <li key={expense.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {expense.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {expense.category} • {format(new Date(expense.date), "PP")}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm font-semibold text-gray-900">
                  ${expense.amount}
                </div>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
