const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await ServiceRequest.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create sample users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@campus.edu',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        department: 'Administration',
        phone: '9876543210'
      },
      {
        name: 'John Student',
        email: 'john.student@campus.edu',
        password: await bcrypt.hash('student123', 12),
        role: 'student',
        department: 'Computer Science',
        phone: '9876543211',
        studentId: 'CS2024001'
      },
      {
        name: 'Dr. Sarah Faculty',
        email: 'sarah.faculty@campus.edu',
        password: await bcrypt.hash('faculty123', 12),
        role: 'faculty',
        department: 'Mathematics',
        phone: '9876543212',
        employeeId: 'FAC2024001'
      },
      {
        name: 'Mike Technician',
        email: 'mike.tech@campus.edu',
        password: await bcrypt.hash('tech123', 12),
        role: 'technician',
        department: 'IT Support',
        phone: '9876543213',
        employeeId: 'TECH2024001'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Created sample users');

    // Create sample service requests
    const requests = [
      {
        requestId: 'REQ2024001',
        userId: createdUsers[1]._id, // John Student
        title: 'WiFi Connection Issue in Library',
        description: 'Unable to connect to campus WiFi in the main library. Connection keeps dropping.',
        category: 'it_support',
        priority: 'medium',
        status: 'pending',
        location: 'Main Library - 2nd Floor',
        urgencyLevel: 'normal'
      },
      {
        requestId: 'REQ2024002',
        userId: createdUsers[2]._id, // Dr. Sarah Faculty
        title: 'Projector Not Working',
        description: 'Classroom projector is not displaying properly. Screen appears dim and flickering.',
        category: 'maintenance',
        priority: 'high',
        status: 'in_progress',
        location: 'Academic Block - Room 301',
        assignedTo: createdUsers[3]._id, // Mike Technician
        urgencyLevel: 'urgent'
      },
      {
        requestId: 'REQ2024003',
        userId: createdUsers[1]._id, // John Student
        title: 'Air Conditioning Issue',
        description: 'AC unit in dormitory room is making loud noises and not cooling properly.',
        category: 'facilities',
        priority: 'medium',
        status: 'resolved',
        location: 'Hostel Block A - Room 205',
        assignedTo: createdUsers[3]._id,
        resolutionNotes: 'Replaced AC filter and serviced the unit. Working properly now.',
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        urgencyLevel: 'normal'
      }
    ];

    await ServiceRequest.insertMany(requests);
    console.log('📋 Created sample service requests');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📧 Sample Login Credentials:');
    console.log('Admin: admin@campus.edu / admin123');
    console.log('Student: john.student@campus.edu / student123');
    console.log('Faculty: sarah.faculty@campus.edu / faculty123');
    console.log('Technician: mike.tech@campus.edu / tech123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();