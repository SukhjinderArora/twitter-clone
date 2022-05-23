const createError = require('http-errors');

const prisma = require('../services/connect-db');

const getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        profile: true,
        createdAt: true,
        followedBy: true,
        following: true,
        _count: {
          select: {
            followedBy: true,
            following: true,
          },
        },
      },
    });
    if (!user) {
      const error = createError.NotFound();
      throw error;
    }
    delete user.hashedPassword;
    delete user.newUser;
    delete user.googleId;
    delete user.provider;
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

const getAllPostsByUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      const error = createError.NotFound();
      throw error;
    }
    const posts = await prisma.post.findMany({
      where: {
        userId: Number(id),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                name: true,
                img: true,
              },
            },
          },
        },
        replies: true,
        reposts: true,
        likes: true,
        _count: {
          select: {
            replies: true,
            reposts: true,
            likes: true,
          },
        },
      },
    });
    return res.status(200).json({ posts });
  } catch (error) {
    return next(error);
  }
};

const getAllLikedPostsByUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      const error = createError.NotFound();
      throw error;
    }
    const likedPosts = await prisma.like.findMany({
      where: {
        userId: Number(id),
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    name: true,
                    img: true,
                  },
                },
              },
            },
            replies: true,
            reposts: true,
            likes: true,
            _count: {
              select: {
                replies: true,
                reposts: true,
                likes: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ likedPosts });
  } catch (error) {
    return next(error);
  }
};

const followUser = async (req, res, next) => {
  const { followeeId } = req.body;
  const { userId } = req;
  try {
    const followee = await prisma.user.findUnique({
      where: {
        id: Number(followeeId),
      },
    });
    if (!followee) {
      const error = createError.NotFound();
      throw error;
    }
    if (followee.id === userId) {
      const error = createError.Forbidden();
      throw error;
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        following: {
          connect: {
            id: Number(followeeId),
          },
        },
      },
    });
    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return next(error);
  }
};

const unFollowUser = async (req, res, next) => {
  const { followeeId } = req.body;
  const { userId } = req;
  try {
    const followee = await prisma.user.findUnique({
      where: {
        id: Number(followeeId),
      },
    });
    if (!followee) {
      const error = createError.NotFound();
      throw error;
    }
    if (followee.id === userId) {
      const error = createError.Forbidden();
      throw error;
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        following: {
          disconnect: [
            {
              id: followee.id,
            },
          ],
        },
      },
    });
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
};

const getFollowersList = async (req, res, next) => {
  const { id } = req.params;
  const { skip = 0, take = 10 } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      const error = createError.NotFound();
      throw error;
    }
    const followers = await prisma.user.findMany({
      where: {
        following: {
          some: {
            id: Number(id),
          },
        },
      },
      skip: Number(skip),
      take: Number(take),
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            name: true,
            img: true,
          },
        },
      },
    });
    return res.status(200).json({ followers });
  } catch (error) {
    return next(error);
  }
};

const getFolloweesList = async (req, res, next) => {
  const { id } = req.params;
  const { skip = 0, take = 10 } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      const error = createError.NotFound();
      throw error;
    }
    const followers = await prisma.user.findMany({
      where: {
        followedBy: {
          some: {
            id: Number(id),
          },
        },
      },
      skip: Number(skip),
      take: Number(take),
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            name: true,
            img: true,
          },
        },
      },
    });
    return res.status(200).json({ followers });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUserByUsername,
  getAllPostsByUser,
  getAllLikedPostsByUser,
  followUser,
  unFollowUser,
  getFollowersList,
  getFolloweesList,
};
