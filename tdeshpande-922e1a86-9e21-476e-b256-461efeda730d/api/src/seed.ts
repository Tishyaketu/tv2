import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';
import { UserRole, TaskCategory, TaskStatus } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Seeding database...');

  // Clear existing data
  await dataSource.getRepository(Task).clear();
  await dataSource.getRepository(User).clear();
  await dataSource.getRepository(Organization).clear();

  // Create Organizations
  const parentOrg = await dataSource.getRepository(Organization).save({
    name: 'Acme Corp',
  });

  const childOrg = await dataSource.getRepository(Organization).save({
    name: 'Acme Engineering',
    parent: parentOrg,
  });

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner = await dataSource.getRepository(User).save({
    email: 'owner@acme.com',
    password: hashedPassword,
    name: 'John Owner',
    role: UserRole.OWNER,
    organization: parentOrg,
  });

  const admin = await dataSource.getRepository(User).save({
    email: 'admin@acme.com',
    password: hashedPassword,
    name: 'Jane Admin',
    role: UserRole.ADMIN,
    organization: parentOrg,
  });

  const viewer = await dataSource.getRepository(User).save({
    email: 'viewer@acme.com',
    password: hashedPassword,
    name: 'Bob Viewer',
    role: UserRole.VIEWER,
    organization: childOrg,
  });

  // Create Tasks
  await dataSource.getRepository(Task).save([
    {
      title: 'Setup project repository',
      description: 'Initialize Git and create initial structure',
      category: TaskCategory.WORK,
      status: TaskStatus.COMPLETED,
      order: 1,
      organization: parentOrg,
      createdBy: owner,
    },
    {
      title: 'Design database schema',
      description: 'Create ERD and entity models',
      category: TaskCategory.WORK,
      status: TaskStatus.IN_PROGRESS,
      order: 2,
      organization: parentOrg,
      createdBy: admin,
    },
    {
      title: 'Review quarterly goals',
      description: 'Prepare for Q4 planning meeting',
      category: TaskCategory.PERSONAL,
      status: TaskStatus.PENDING,
      order: 3,
      organization: childOrg,
      createdBy: viewer,
    },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\nTest Credentials:');
  console.log('Owner: owner@acme.com / password123');
  console.log('Admin: admin@acme.com / password123');
  console.log('Viewer: viewer@acme.com / password123');

  await app.close();
}

bootstrap();
