// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const itemRoutes = require('./routes/itemRoutes');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
console.log(process.env.MONGO_URI);
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/cs348-db", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
