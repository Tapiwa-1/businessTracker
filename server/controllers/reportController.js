import db from '../config/db.js';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let dateFilter = '';
    const params = [userId];

    if (startDate && endDate) {
      dateFilter = ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Filtered totals
    const incomeResult = await db.get(`SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "income" ${dateFilter}`, params);
    const expenseResult = await db.get(`SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "expense" ${dateFilter}`, params);

    const totalIncome = incomeResult.total || 0;
    const totalExpenses = expenseResult.total || 0;
    const profit = totalIncome - totalExpenses;

    // Chart Data (Daily Aggregates)
    // We group by date. Since SQLite stores dates as strings YYYY-MM-DD, we can group directly.
    const chartQuery = `
      SELECT date,
             SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
             SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE user_id = ? ${dateFilter}
      GROUP BY date
      ORDER BY date ASC
    `;

    const chartData = await db.all(chartQuery, params);

    res.json({
      summary: {
        income: totalIncome,
        expenses: totalExpenses,
        profit
      },
      chartData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
