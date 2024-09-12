
const express = require("express");
const dotenv = require("dotenv");
const session = require('express-session');
const connectDB = require("./configs/database");
const userRoutes = require('./routes/userRoute');
const twilio = require('twilio');




dotenv.config();
connectDB(process.env.MONGO_URI);

const app = express();
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(express.json());
app.use('/users', userRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

