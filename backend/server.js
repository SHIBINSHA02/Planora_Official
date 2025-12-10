// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const auth =require('./routes/auth')
const teacherRoutes = require('./routes/teacherRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const { teacherEmitter } = require('./controllers/teacherController');
const automate = require('./routes/automate')
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/planora_official', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
const frontendURL ='http://localhost:5173';

app.use(cors({
  origin: 'http://localhost:5173', // EXACT URL of your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // ESSENTIAL because your frontend uses withCredentials: true
}));// No config object - allows all origins ('*')

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth',auth)
app.use('/api/teachers', teacherRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/automate', automate)

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  
  },
});

io.on('connection', (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`🔴 Client disconnected: ${socket.id}`));
});

// ----------------------------
// Connect EventEmitter to Socket.IO
// ----------------------------
teacherEmitter.on('teacher_created', (teacher) => {
  console.log('📢 Broadcasting new teacher to clients:', teacher.teacherid);
  io.emit('teacher_added', teacher);
});

// ----------------------------
// Start Server
// ----------------------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Teacher API: http://localhost:${PORT}/api/teachers`);
});
