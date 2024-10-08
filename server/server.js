const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const authRoutes = require("./routes/authenticationsRoutes");
const patientRoutes = require('./routes/patientIndexRoutes'); 
const adminRoutes = require("./routes/adminRoutes");
const psyRoutes = require("./routes/psyIndexRoutes");

require('dotenv').config();

const app = express();
// Serve all static files from 'client' directory
app.use(express.static(path.join(__dirname, '../client')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501', 'http://184.73.250.53:5500'],  //Cross Origin Request w/ Frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,  
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Set up session middleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // Set session timeout to 24 hours (in milliseconds)
        httpOnly: true,  // Prevents JavaScript from accessing the cookie
        sameSite: 'strict', 
    }
}));

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 

app.use('/api', authRoutes);
app.use('/api', patientRoutes);
app.use('/api', adminRoutes);
app.use('/api', psyRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
