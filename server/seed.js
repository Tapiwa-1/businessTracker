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

    // Insert all transactions
    const stmt = await db.prepare('INSERT INTO transactions (user_id, type, date, amount, source, name, comments) VALUES (?, ?, ?, ?, ?, ?, ?)');

    for (const t of transactions) {
      await stmt.run([t.user_id, t.type, t.date, t.amount, t.source, t.name, t.comments]);
    }
    await stmt.finalize();

    console.log(`Inserted ${transactions.length} dummy transactions.`);


    // --- Seed Equipment ---
    // Clear existing equipment for this user
    await db.run('DELETE FROM equipment WHERE user_id = ?', [user.id]);
    console.log('Cleared existing equipment.');

    const equipmentList = [
      { name: 'JBL SRX 815', category: 'Speaker', serial_number: 'JBL-SRX-001', specs: '2000W Active', price: 1400.00, condition: 'Good', status: 'Available' },
      { name: 'JBL SRX 815', category: 'Speaker', serial_number: 'JBL-SRX-002', specs: '2000W Active', price: 1400.00, condition: 'Good', status: 'Available' },
      { name: 'Shure SM58', category: 'Mic', serial_number: 'SH-SM58-101', specs: 'Dynamic Vocal Mic', price: 99.00, condition: 'Good', status: 'Available' },
      { name: 'Shure SM58', category: 'Mic', serial_number: 'SH-SM58-102', specs: 'Dynamic Vocal Mic', price: 99.00, condition: 'Fair', status: 'Out for hire' },
      { name: 'Behringer X32', category: 'Mixer', serial_number: 'BEH-X32-555', specs: '32-Channel Digital Mixer', price: 2500.00, condition: 'Good', status: 'Available' },
      { name: 'QSC K12.2', category: 'Speaker', serial_number: 'QSC-K12-777', specs: '2000W Active', price: 900.00, condition: 'Needs Repair', status: 'Under maintenance' },
      { name: 'XLR Cable 20ft', category: 'Cable', serial_number: '', specs: '20ft Balanced', price: 25.00, condition: 'Good', status: 'Available' },
      { name: 'XLR Cable 20ft', category: 'Cable', serial_number: '', specs: '20ft Balanced', price: 25.00, condition: 'Good', status: 'Available' },
    ];

    const equipStmt = await db.prepare(
      'INSERT INTO equipment (user_id, name, category, serial_number, specs, price, condition, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    for (const item of equipmentList) {
      await equipStmt.run([
        user.id,
        item.name,
        item.category,
        item.serial_number,
        item.specs,
        item.price,
        item.condition,
        item.status
      ]);
    }
    await equipStmt.finalize();
    console.log(`Inserted ${equipmentList.length} dummy equipment items.`);

    console.log('Seeding complete.');

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
