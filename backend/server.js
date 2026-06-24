const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const connectDB = require('./config/db');

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}
connectDB();

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: frontendUrl }));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/voitures', require('./routes/carRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/api', (req, res) => {
  res.json({ message: 'API IND Location' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
