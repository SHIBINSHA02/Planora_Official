// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { ClerkExpressWithAuth } = require("@clerk/express");

const auth = require('./routes/auth');
const teacherRoutes = require('./routes/teacherRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const automate = require('./routes/automate');
const scheduleRoutes = require("./routes/scheduleRoutes");
const organisationRoutes = require("./routes/organisationRoutes");
const { teacherEmitter } = require('./controllers/teacherController');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// MongoDB
mongoose.connect(process.env.MongoDB)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB error:', err));

// CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// ⬅️ Clerk Middleware (GLOBAL)
const { requireAuth } = require("@clerk/express");


// Routes
app.use('/api/auth', auth);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/automate', automate);
app.use("/api/organisations", organisationRoutes);

// Socket.io
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET","POST","PUT","DELETE"] }
});

io.on("connection", socket => {
  console.log(`🟢 Connected: ${socket.id}`);
  socket.on("disconnect", () => console.log(`🔴 Disconnected: ${socket.id}`));
});

teacherEmitter.on("teacher_created", teacher => {
  console.log("📢 Broadcasting:", teacher.teacherid);
  io.emit("teacher_added", teacher);
});

server.listen(PORT, () =>
  console.log(`🚀 Server on http://localhost:${PORT}`)
);
