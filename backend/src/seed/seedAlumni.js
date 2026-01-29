const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedAlumniIfEmpty() {
  const count = await User.countDocuments({ role: 'alumni' });
  if (count > 0) {
    return;
  }

  console.log('🌱 No alumni found, seeding demo alumni data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const demoAlumni = [
    {
      fullName: 'Amey Patil',
      email: 'amey.patil@example.com',
      passwordHash,
      phone: '9999999999',
      department: 'Computer Engineering',
      year: '2018',
      role: 'alumni',
      graduationYear: '2018',
      currentCompany: 'Juspay',
      designation: 'Software Engineer',
      location: 'India',
      skills: ['Backend', 'Java', 'System Design'],
      bio: 'Passionate about scalable backend systems and mentoring students.',
    },
    {
      fullName: 'Chemical Dept Director',
      email: 'chem.director@example.com',
      passwordHash,
      phone: '8888888888',
      department: 'Chemical Engineering',
      year: '2010',
      role: 'alumni',
      graduationYear: '2010',
      currentCompany: 'Process Corp',
      designation: 'Director',
      location: 'India',
      skills: ['Process Design', 'Plant Operations'],
      bio: 'Helping students understand the core opportunities in chemical engineering.',
    },
    {
      fullName: 'BARC Scientist',
      email: 'barc.scientist@example.com',
      passwordHash,
      phone: '7777777777',
      department: 'Mechanical Engineering',
      year: '2015',
      role: 'alumni',
      graduationYear: '2015',
      currentCompany: 'BARC',
      designation: 'Scientist',
      location: 'India',
      skills: ['Research', 'Nuclear Engineering'],
      bio: 'Research scientist mentoring students interested in government R&D roles.',
    },
  ];

  await User.insertMany(demoAlumni);

  console.log('✅ Demo alumni seeded successfully.');
}

module.exports = { seedAlumniIfEmpty };

