const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const toDoRoutes = require('./routes/ToDoRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api', authRoutes);
app.use('/api/todo', toDoRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});


mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("✅ DB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ DB ERROR:", err);
  });


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});