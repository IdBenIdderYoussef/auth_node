const express = require('express');
const connectDB = require('./config/db');
const auth = require('./routes/auth');
const user = require('./routes/user');
const mongoose =  require('mongoose');
require('dotenv').config();

const app = express();

// Connect Database
//connectDB()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then((result) => console.log("MongoDB successfully connected"))
    .catch((err) => console.log(err))

// Init Middleware
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', auth)
app.use('/api/users', user)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));