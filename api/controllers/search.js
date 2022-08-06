const prisma = require('../services/connect-db');

const searchUsersByUsername = async (req, res, next) => {
  const { username } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    const total = await prisma.user.count({
      where: {
        username: {
          startsWith: username,
          mode: 'insensitive',
        },
      },
    });
    const users = await prisma.user.findMany({
      where: {
        username: {
          startsWith: username,
          mode: 'insensitive',
        },
      },
      select: {
        username: true,
        profile: {
          select: {
            name: true,
            img: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return res.status(200).json({
      info: {
        total,
        nextPage: total > (page - 1) * limit + users.length ? page + 1 : null,
        prevPage: page === 1 ? null : page - 1,
      },
      results: users,
    });
  } catch (error) {
    return next(error);
  }
};

const searchUsersByName = () => {};

module.exports = {
  searchUsersByUsername,
  searchUsersByName,
};
