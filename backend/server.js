// app.js (Main Express file)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- ADDED: Import the CORS package
const teacherRoutes = require('./routes/teacherRoutes'); 

const app = express();
const PORT = 3000;

// Connect to MongoDB (Ensure MongoDB is running locally)
mongoose.connect('mongodb://localhost:27017/planora_official')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use(cors()); 
// Middleware
app.use(express.json()); // Essential for parsing the JSON body of the POST request

// Use the Teacher Routes
// All teacher routes will be prefixed with /api/teachers
app.use('/api/teachers', teacherRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Teacher API available at http://localhost:${PORT}/api/teachers`);
});
