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
        _count: {
          select: {
            followedBy: true,
            following: true,
          },
        },
        followedBy: true,
        following: true,
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
  const { userId } = req;
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId,
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
  const { userId } = req;
  try {
    const likedPosts = await prisma.like.findMany({
      where: {
        userId,
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

module.exports = {
  getUserByUsername,
  getAllPostsByUser,
  getAllLikedPostsByUser,
  followUser,
  unFollowUser,
};
