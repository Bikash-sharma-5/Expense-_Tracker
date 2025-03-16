

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  user_id: string;
  created_at: string;
 
}

export interface User {
  id: string;
  email: string;
}