const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password inside async function
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create first professor
  const prof1 = await prisma.professor.upsert({
    where: { email: 'john@university.edu' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@university.edu',
      password: hashedPassword,
      courses: {
        create: [
          {
            title: 'Introduction to Computer Science',
            description: 'Fundamental concepts of programming and computer science',
            semester: 'Fall 2024',
          },
          {
            title: 'Data Structures and Algorithms',
            description: 'Advanced data structures and algorithmic problem-solving',
            semester: 'Spring 2025',
          },
          {
            title: 'Web Development',
            description: 'Full-stack web development with modern frameworks',
            semester: 'Fall 2024',
          },
        ],
      },
    },
  });

  // Create second professor
  const prof2 = await prisma.professor.upsert({
    where: { email: 'jane@university.edu' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@university.edu',
      password: hashedPassword,
      courses: {
        create: [
          {
            title: 'Database Systems',
            description: 'Relational and NoSQL database design and optimization',
            semester: 'Spring 2025',
          },
          {
            title: 'Software Engineering',
            description: 'Software development methodologies and best practices',
            semester: 'Fall 2024',
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📚 Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email: john@university.edu | Password: password123 | Courses: 3');
  console.log('Email: jane@university.edu | Password: password123 | Courses: 2');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the seed
main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
