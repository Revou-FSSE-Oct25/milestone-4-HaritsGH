import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seeding...');
  
  // Create user
  const psword = 'password123';
  const john = await prisma.user.upsert({
    where: { username: 'johndoe' },
    update: {},
    create: {
      username: 'johndoe',
      userpw: bcrypt.hashSync(psword, 10),
      email: 'john.doe@example.com',
    },
  });
  console.log('Created user john');

  const alice = await prisma.user.upsert({
    where: { username: 'alicedoe' },
    update: {},
    create: {
      username: 'alicedoe',
      userpw: bcrypt.hashSync(psword, 10),
      email: 'alice.doe@example.com',
    },
  });
  console.log('Created user alice');

  // Create profile for the user
  const profile = await prisma.profile.upsert({
    where: { username: 'johndoe' },
    update: {},
    create: {
      username: 'johndoe',
      fullname: 'John Doe',
    },
  });
  console.log('Created profile john');

  const profile2 = await prisma.profile.upsert({
    where: { username: 'alicedoe' },
    update: {},
    create: {
      username: 'alicedoe',
      fullname: 'Alice Doe',
      favnum: 42,
    },
  });
  console.log('Created profile alice');

  // Create account for the user
  const account = await prisma.account.upsert({
    where: { geneid: 'ACC00001' },
    update: {},
    create: {
      owner: 'johndoe',
      geneid: 'ACC00001',
      balance: 1000.50,
    },
  });
  console.log('Created account john');

  const account2 = await prisma.account.upsert({
    where: { geneid: 'ACC00002' },
    update: {},
    create: {
      owner: 'alicedoe',
      geneid: 'ACC00002',
      balance: 0,
    },
  });
  console.log('Created account alice');

  // Create transactions for the account
  const deposit = await prisma.transaction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      txprocess: 'D',
      amount: 1000.50,
      doneAt: new Date(),
      accountGenId: 'ACC00001',
    },
  });
  console.log('Created deposit transaction:', deposit);
  
  const withdraw = await prisma.transaction.upsert({
    where: { id: 2 },
    update: {},
    create: {
      txprocess: 'W',
      amount: 500.50,
      doneAt: new Date(),
      accountGenId: 'ACC00002',
    },
  });
  console.log('Created withdraw transaction:', withdraw);
  
  const transfer = await prisma.transaction.upsert({
    where: { id: 3 },
    update: {},
    create: {
      txprocess: 'T',
      amount: 250.50,
      doneAt: new Date(),
      accountGenId: 'ACC00001',
      transferTo: 'ACC00002',
    },
  });
  console.log('Created transfer transaction:', transfer);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

