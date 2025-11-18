import { PrismaClient, UserRole, CardStatus, CardPriority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean database
  await prisma.dailyExportLog.deleteMany();
  await prisma.integrationConfig.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.dailyStatus.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create Organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      settings: {
        defaultWorkHours: 8,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
    },
  });

  console.log('✅ Created organization:', organization.name);

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: 'admin@acme.com',
      passwordHash,
      name: 'Admin User',
      role: UserRole.ORG_ADMIN,
      position: 'CTO',
    },
  });

  const teamLead = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: 'lead@acme.com',
      passwordHash,
      name: 'John Team Lead',
      role: UserRole.TEAM_LEAD,
      position: 'Engineering Manager',
    },
  });

  const employee1 = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: 'alice@acme.com',
      passwordHash,
      name: 'Alice Developer',
      role: UserRole.EMPLOYEE,
      position: 'Senior Developer',
    },
  });

  const employee2 = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: 'bob@acme.com',
      passwordHash,
      name: 'Bob Designer',
      role: UserRole.EMPLOYEE,
      position: 'UX Designer',
    },
  });

  console.log('✅ Created 4 users');

  // Create Teams
  const engineeringTeam = await prisma.team.create({
    data: {
      organizationId: organization.id,
      name: 'Engineering',
      description: 'Software development team',
    },
  });

  const designTeam = await prisma.team.create({
    data: {
      organizationId: organization.id,
      name: 'Design',
      description: 'Product design team',
    },
  });

  console.log('✅ Created 2 teams');

  // Add team members
  await prisma.teamMember.createMany({
    data: [
      { teamId: engineeringTeam.id, userId: teamLead.id },
      { teamId: engineeringTeam.id, userId: employee1.id },
      { teamId: designTeam.id, userId: employee2.id },
    ],
  });

  console.log('✅ Added team members');

  // Create Boards
  const sprintBoard = await prisma.board.create({
    data: {
      organizationId: organization.id,
      teamId: engineeringTeam.id,
      name: 'Sprint 24 - Q1 2025',
      description: 'Current sprint board for engineering team',
      createdBy: teamLead.id,
    },
  });

  const designBoard = await prisma.board.create({
    data: {
      organizationId: organization.id,
      teamId: designTeam.id,
      name: 'Design Projects',
      description: 'Design team projects and tasks',
      createdBy: admin.id,
    },
  });

  console.log('✅ Created 2 boards');

  // Add board members
  await prisma.boardMember.createMany({
    data: [
      { boardId: sprintBoard.id, userId: teamLead.id, role: 'OWNER' },
      { boardId: sprintBoard.id, userId: employee1.id, role: 'MEMBER' },
      { boardId: designBoard.id, userId: admin.id, role: 'OWNER' },
      { boardId: designBoard.id, userId: employee2.id, role: 'MEMBER' },
    ],
  });

  // Create Lists
  const todoList = await prisma.list.create({
    data: {
      boardId: sprintBoard.id,
      name: 'To Do',
      position: 0,
    },
  });

  const inProgressList = await prisma.list.create({
    data: {
      boardId: sprintBoard.id,
      name: 'In Progress',
      position: 1,
    },
  });

  const reviewList = await prisma.list.create({
    data: {
      boardId: sprintBoard.id,
      name: 'Review',
      position: 2,
    },
  });

  const doneList = await prisma.list.create({
    data: {
      boardId: sprintBoard.id,
      name: 'Done',
      position: 3,
    },
  });

  console.log('✅ Created 4 lists');

  // Create Cards
  await prisma.card.createMany({
    data: [
      {
        boardId: sprintBoard.id,
        listId: todoList.id,
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication to the API',
        assigneeId: employee1.id,
        status: CardStatus.TODO,
        priority: CardPriority.HIGH,
        estimateHours: 8,
        dueDate: new Date('2025-01-25'),
        createdBy: teamLead.id,
        position: 0,
      },
      {
        boardId: sprintBoard.id,
        listId: todoList.id,
        title: 'Design database schema',
        description: 'Create comprehensive database schema for all entities',
        assigneeId: employee1.id,
        status: CardStatus.TODO,
        priority: CardPriority.MEDIUM,
        estimateHours: 4,
        dueDate: new Date('2025-01-22'),
        createdBy: teamLead.id,
        position: 1,
      },
      {
        boardId: sprintBoard.id,
        listId: inProgressList.id,
        title: 'Build Kanban board UI',
        description: 'Implement drag-and-drop Kanban board interface',
        assigneeId: employee2.id,
        status: CardStatus.IN_PROGRESS,
        priority: CardPriority.HIGH,
        estimateHours: 12,
        dueDate: new Date('2025-01-28'),
        createdBy: teamLead.id,
        position: 0,
      },
      {
        boardId: sprintBoard.id,
        listId: doneList.id,
        title: 'Set up project repository',
        description: 'Initialize Git repository and project structure',
        assigneeId: employee1.id,
        status: CardStatus.DONE,
        priority: CardPriority.MEDIUM,
        estimateHours: 2,
        createdBy: teamLead.id,
        position: 0,
      },
    ],
  });

  console.log('✅ Created 4 cards');

  // Create Daily Statuses
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyStatus.createMany({
    data: [
      {
        userId: employee1.id,
        date: today,
        summary: 'Working on authentication module. Made good progress on JWT implementation.',
        blockers: 'None',
        mood: 'HAPPY',
      },
      {
        userId: employee2.id,
        date: today,
        summary: 'Designing the Kanban board interface. Created wireframes and mockups.',
        blockers: 'Waiting for design system approval',
        mood: 'NEUTRAL',
      },
    ],
  });

  console.log('✅ Created daily statuses');

  // Create Integration Config
  await prisma.integrationConfig.create({
    data: {
      organizationId: organization.id,
      type: 'SOAP',
      endpointUrl: 'https://external-hr-system.com/soap/endpoint',
      credentials: {
        username: 'acme_user',
        password: 'encrypted_password',
      },
      isActive: false, // Disabled by default
    },
  });

  console.log('✅ Created integration config');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📋 Demo Login Credentials:');
  console.log('   Admin:     admin@acme.com / password123');
  console.log('   Team Lead: lead@acme.com / password123');
  console.log('   Employee:  alice@acme.com / password123');
  console.log('   Employee:  bob@acme.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
