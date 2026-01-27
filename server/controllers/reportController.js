import db from '../config/db.js';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Overall totals
    const incomeResult = await db.get('SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "income"', [userId]);
    const expenseResult = await db.get('SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "expense"', [userId]);

    const totalIncome = incomeResult.total || 0;
    const totalExpenses = expenseResult.total || 0;
    const profit = totalIncome - totalExpenses;

    // Monthly performance (current month)
    const now = new Date();
    // SQLite dates are stored as strings (YYYY-MM-DD usually from our frontend),
    // but the `addTransaction` uses Joi iso validation, so it comes as a Date object or ISO string.
    // In `transactionController` we insert whatever `req.body.date` is. The frontend sends YYYY-MM-DD from <input type="date">.
    // So we can compare string directly if format is ISO-8601 (YYYY-MM-DD).
    // Let's ensure we compare against YYYY-MM-01.

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Format to YYYY-MM-DD
    const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

    const monthlyIncomeResult = await db.get('SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "income" AND date >= ?', [userId, startOfMonthStr]);
    const monthlyExpenseResult = await db.get('SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "expense" AND date >= ?', [userId, startOfMonthStr]);

    const monthlyIncome = monthlyIncomeResult.total || 0;
    const monthlyExpenses = monthlyExpenseResult.total || 0;
    const monthlyProfit = monthlyIncome - monthlyExpenses;

    res.json({
      overall: {
        income: totalIncome,
        expenses: totalExpenses,
        profit
      },
      monthly: {
        income: monthlyIncome,
        expenses: monthlyExpenses,
        profit: monthlyProfit
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
