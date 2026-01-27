import { initializeDb } from './config/db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    const db = await initializeDb();

    console.log('Seeding database...');

    const email = 'demo@example.com';
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      const result = await db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        ['Demo User', email, hashedPassword]
      );
      user = { id: result.lastID };
      console.log(`Created user: ${email} / ${password}`);
    } else {
      console.log(`User ${email} already exists. ID: ${user.id}`);
      // Update password to ensure it matches 'password'
      await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
    }

    // Clear existing transactions for this user
    await db.run('DELETE FROM transactions WHERE user_id = ?', [user.id]);
    console.log('Cleared existing transactions.');

    // Generate transactions
    const transactions = [];
    const today = new Date();

    // Helper to format date YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      // Random Income
      if (Math.random() > 0.8) {
          transactions.push({
              user_id: user.id,
              type: 'income',
              date: dateStr,
              amount: parseFloat((Math.random() * 500 + 100).toFixed(2)),
              source: 'Freelance',
              comments: 'Project payment'
          });
      }

      // Monthly Salary (e.g., 1st or 15th)
      if (date.getDate() === 1 || date.getDate() === 15) {
          transactions.push({
              user_id: user.id,
              type: 'income',
              date: dateStr,
              amount: 2500.00,
              source: 'Salary',
              comments: 'Bi-weekly pay'
          });
      }

      // Daily Expenses
      if (Math.random() > 0.3) {
          const categories = ['Groceries', 'Transport', 'Dining Out', 'Entertainment'];
          const category = categories[Math.floor(Math.random() * categories.length)];
          transactions.push({
              user_id: user.id,
              type: 'expense',
              date: dateStr,
              amount: parseFloat((Math.random() * 100 + 10).toFixed(2)),
              name: category,
              comments: 'Daily spend'
          });
      }

       // Monthly Rent (1st)
      if (date.getDate() === 1) {
          transactions.push({
              user_id: user.id,
              type: 'expense',
              date: dateStr,
              amount: 1200.00,
              name: 'Rent',
              comments: 'Monthly rent'
          });
      }
    }

    // Insert all
    const stmt = await db.prepare('INSERT INTO transactions (user_id, type, date, amount, source, name, comments) VALUES (?, ?, ?, ?, ?, ?, ?)');

    for (const t of transactions) {
      await stmt.run([t.user_id, t.type, t.date, t.amount, t.source, t.name, t.comments]);
    }
    await stmt.finalize();

    console.log(`Inserted ${transactions.length} dummy transactions.`);
    console.log('Seeding complete.');

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
