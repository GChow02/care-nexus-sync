const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection - Replace with your actual MongoDB Atlas URL
const MONGODB_URL = 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vitalsync?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  doctorName: { type: String, required: true },
  userType: { type: String, enum: ['patient', 'doctor'], required: true },
  dateOfBirth: String,
  bloodGroup: String,
  gender: String,
  allergies: [String],
  medicalHistory: String,
  conditions: [String],
  status: { type: String, enum: ['active', 'inactive', 'critical'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Health Data Schema
const healthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  heartRate: Number,
  bloodPressure: String,
  weight: Number,
  sleep: Number,
  glucose: Number,
  steps: Number,
  water: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const HealthData = mongoose.model('HealthData', healthDataSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  assignedDate: { type: Date, default: Date.now },
  completedDate: Date
});

const Task = mongoose.model('Task', taskSchema);

// Suggestion Schema
const suggestionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  suggestion: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

// Routes

// Register User
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password, doctorName, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      doctorName,
      userType
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        doctorName: user.doctorName,
        userType: user.userType,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login User
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        doctorName: user.doctorName,
        userType: user.userType,
        status: user.status,
        dateOfBirth: user.dateOfBirth,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        allergies: user.allergies,
        medicalHistory: user.medicalHistory,
        conditions: user.conditions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Profile
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update User Profile
app.put('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add Health Data
app.post('/api/health-data', async (req, res) => {
  try {
    const healthData = new HealthData(req.body);
    await healthData.save();
    res.status(201).json(healthData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Health Data for User
app.get('/api/health-data/:userId', async (req, res) => {
  try {
    const healthData = await HealthData.find({ userId: req.params.userId })
      .sort({ date: -1 });
    res.json(healthData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Patients (for doctors)
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await User.find({ userType: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Patients by Doctor Name
app.get('/api/patients/doctor/:doctorName', async (req, res) => {
  try {
    const patients = await User.find({ 
      userType: 'patient', 
      doctorName: req.params.doctorName 
    }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign Task to Patient
app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Tasks for Patient
app.get('/api/tasks/:patientId', async (req, res) => {
  try {
    const tasks = await Task.find({ patientId: req.params.patientId })
      .populate('doctorId', 'fullName')
      .sort({ assignedDate: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Task Status
app.put('/api/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { 
        completed: req.body.completed,
        completedDate: req.body.completed ? new Date() : null
      },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add Suggestion
app.post('/api/suggestions', async (req, res) => {
  try {
    const suggestion = new Suggestion(req.body);
    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Suggestions for Patient
app.get('/api/suggestions/:patientId', async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ patientId: req.params.patientId })
      .populate('doctorId', 'fullName')
      .sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'VitalSync API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VitalSync server running on port ${PORT}`);
});

module.exports = app;