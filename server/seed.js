const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Event.deleteMany();

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'password123',
      role: 'admin',
    });

    const organizer = await User.create({
      name: 'Organizer User',
      email: 'organizer@demo.com',
      password: 'password123',
      role: 'organizer',
    });

    const attendee = await User.create({
      name: 'Attendee User',
      email: 'attendee@demo.com',
      password: 'password123',
      role: 'attendee',
    });

    // Create categories
    const workshop = await Category.create({ name: 'Workshop' });
    const seminar = await Category.create({ name: 'Seminar' });

    // Create sample events
    await Event.create({
      title: 'Introduction to MERN Stack',
      description: 'A beginner-friendly workshop on MongoDB, Express, React, and Node.js',
      category: workshop._id,
      organizer: organizer._id,
      venue: 'Main Auditorium',
      city: 'Lahore',
      startAt: new Date('2026-09-15T10:00:00.000Z'),
      endAt: new Date('2026-09-15T14:00:00.000Z'),
      capacity: 50,
      status: 'published',
      registrationDeadline: new Date('2026-09-13T23:59:59.000Z'),
      cancellationDeadline: new Date('2026-09-14T23:59:59.000Z'),
    });

    await Event.create({
      title: 'Career Guidance Seminar',
      description: 'Learn about career paths in tech from industry professionals',
      category: seminar._id,
      organizer: organizer._id,
      venue: 'Conference Hall',
      city: 'Karachi',
      startAt: new Date('2026-09-20T09:00:00.000Z'),
      endAt: new Date('2026-09-20T12:00:00.000Z'),
      capacity: 30,
      status: 'pending',
      registrationDeadline: new Date('2026-09-18T23:59:59.000Z'),
      cancellationDeadline: new Date('2026-09-19T23:59:59.000Z'),
    });

    console.log('✅ Seed data created successfully!');
    console.log('Admin: admin@demo.com / password123');
    console.log('Organizer: organizer@demo.com / password123');
    console.log('Attendee: attendee@demo.com / password123');

    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();