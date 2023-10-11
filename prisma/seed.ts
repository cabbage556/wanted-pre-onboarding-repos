import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // seed script
  const company1 = await prisma.company.upsert({
    where: {
      name: '원티드랩',
    },
    update: {},
    create: {
      name: '원티드랩',
      nationality: '대한민국',
      region: '서울',
    },
  });
  const company2 = await prisma.company.upsert({
    where: {
      name: '에이스랩',
    },
    update: {},
    create: {
      name: '에이스랩',
      nationality: '대한민국',
      region: '서울',
    },
  });
  const user1 = await prisma.user.upsert({
    where: {
      email: 'abc@abc.com',
    },
    update: {},
    create: {
      name: '홍길동',
      email: 'abc@abc.com',
      phone: '01012341234',
    },
  });
  const user2 = await prisma.user.upsert({
    where: {
      email: '123@abc.com',
    },
    update: {},
    create: {
      name: '아무개',
      email: '123@abc.com',
      phone: '01011112222',
    },
  });

  console.log('Database seed script 실행');
  console.log('company dummy 데이터 생성');
  console.log({ company1, company2 });
  console.log('user dummy 데이터 생성');
  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client
    console.log('dummy 데이터 생성 후 Prisma Client 종료');
    await prisma.$disconnect();
  });
