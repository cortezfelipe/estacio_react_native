const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/db');
const { User, ParkingSlot } = require('./models');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to the Parking Reservation API' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/slots', require('./routes/parking.routes'));
app.use('/api/reservations', require('./routes/reservation.routes'));

// Synchronize database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    // Sync models.  In production you may want to use migrations instead of sync({force})
    //await sequelize.sync({ alter: true }); // para criar o banco novo
    await sequelize.sync();
    console.log('Database connected and synchronized.');
    // Seed initial manager if none exists
    const managerCount = await User.count({ where: { role: 'manager' } });
    if (managerCount === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin', email: 'admin@example.com', password: hashedPassword, role: 'manager' });
      console.log('Created default manager account: admin@example.com / admin123');
    }
    // Seed some parking slots if none exist
    const slotCount = await ParkingSlot.count();
    if (slotCount === 0) {
      await ParkingSlot.bulkCreate([
        { name: 'A1', description: 'Prime space near entrance' },
        { name: 'A2', description: 'Covered space' },
        { name: 'B1', description: 'Outdoor space' },
      ]);
      console.log('Seeded parking slots.');
    }
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
}

startServer();