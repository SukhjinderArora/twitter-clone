const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      followedBy: true,
      following: true,
    },
  });
  console.log(JSON.stringify(users, undefined, 4));
  return users;
};

getAllUsers();
