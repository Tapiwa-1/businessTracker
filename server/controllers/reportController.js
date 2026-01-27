import db from '../config/db.js';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Overall totals
    const [incomeResult] = await db.execute('SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "income"', [userId]);
    const [expenseResult] = await db.execute('SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "expense"', [userId]);

    const totalIncome = incomeResult[0].total || 0;
    const totalExpenses = expenseResult[0].total || 0;
    const profit = totalIncome - totalExpenses;

    // Monthly performance (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [monthlyIncomeResult] = await db.execute('SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "income" AND date >= ?', [userId, startOfMonth]);
    const [monthlyExpenseResult] = await db.execute('SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "expense" AND date >= ?', [userId, startOfMonth]);

    const monthlyIncome = monthlyIncomeResult[0].total || 0;
    const monthlyExpenses = monthlyExpenseResult[0].total || 0;
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
