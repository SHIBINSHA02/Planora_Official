// app.js (Main Express File)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // <-- ADDED: Import Morgan for logging
const teacherRoutes = require('./routes/teacherRoutes'); 
const classroomRoutes = require('./routes/classroomRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------
// Database Connection
// ------------------------------------
mongoose.connect('mongodb://localhost:27017/planora_official', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ------------------------------------
// Middleware Setup
// ------------------------------------

// Enable CORS for cross-origin requests
app.use(cors());

// Enable request body parsing for JSON
app.use(express.json());

// Add Morgan middleware for request logging
// The 'dev' format gives concise colored output for development
app.use(morgan('dev'));

// ------------------------------------
// Route Handlers
// ------------------------------------
app.use('/api/teachers', teacherRoutes);
app.use('/api/classrooms', classroomRoutes);

// ------------------------------------
// Start Server
// ------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📘 Teacher API: http://localhost:${PORT}/api/teachers`);
    console.log(`📘 Classroom API: http://localhost:${PORT}/api/classrooms`);
});
