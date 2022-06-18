const createError = require('http-errors');

const prisma = require('../services/connect-db');
const {
  NOTIFICATION_TYPE,
  NOTIFICATION_OBJECT_TYPE,
} = require('../utils/enums');

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

const getPostsByUser = async (req, res, next) => {
  const { id } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = 10;
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

    const postCount = await prisma.post.count({
      where: {
        userId: Number(id),
        parentPostId: null,
      },
    });

    const repostCount = await prisma.repost.count({
      where: {
        userId: Number(id),
      },
    });

    const total = postCount + repostCount;

    const posts = await prisma.post.findMany({
      where: {
        userId: Number(id),
        parentPostId: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
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
      },
    });

    const reposts = await prisma.repost.findMany({
      where: {
        userId: Number(id),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
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
          },
        },
      },
    });

    const combinedPosts = [...posts, ...reposts].sort(
      (post1, post2) => new Date(post2.createdAt) - new Date(post1.createdAt)
    );

    return res.status(200).json({
      info: {
        total,
        nextPage:
          total > (page - 1) * limit * 2 + combinedPosts.length
            ? page + 1
            : null,
        prevPage: page === 1 ? null : page - 1,
      },
      results: combinedPosts,
    });
  } catch (error) {
    return next(error);
  }
};

const getLikedPostsByUser = async (req, res, next) => {
  const { id } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
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
    const total = await prisma.like.count({
      where: {
        userId: Number(id),
      },
    });
    const likedPosts = await prisma.like.findMany({
      where: {
        userId: Number(id),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
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
    return res.status(200).json({
      info: {
        total,
        nextPage:
          total > (page - 1) * limit + likedPosts.length ? page + 1 : null,
        prevPage: page === 1 ? null : page - 1,
      },
      results: likedPosts,
    });
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
    res.locals.notification = {
      senderId: userId,
      recipientId: followee.id,
      type: NOTIFICATION_TYPE.FOLLOW,
      objectType: NOTIFICATION_OBJECT_TYPE.USER,
      objectURI: userId,
    };
    res.status(200).json({ message: 'Success' });
    return next();
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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
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
    const total = await prisma.user.count({
      where: {
        following: {
          some: {
            id: Number(id),
          },
        },
      },
    });
    const followers = await prisma.user.findMany({
      where: {
        following: {
          some: {
            id: Number(id),
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
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
    return res.status(200).json({
      info: {
        total,
        nextPage:
          total > (page - 1) * limit + followers.length ? page + 1 : null,
        prevPage: page === 1 ? null : page - 1,
      },
      results: followers,
    });
  } catch (error) {
    return next(error);
  }
};

const getFolloweesList = async (req, res, next) => {
  const { id } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
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
    const total = await prisma.user.count({
      where: {
        followedBy: {
          some: {
            id: Number(id),
          },
        },
      },
    });
    const followees = await prisma.user.findMany({
      where: {
        followedBy: {
          some: {
            id: Number(id),
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
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
    return res.status(200).json({
      info: {
        total,
        nextPage:
          total > (page - 1) * limit + followees.length ? page + 1 : null,
        prevPage: page === 1 ? null : page - 1,
      },
      results: followees,
    });
  } catch (error) {
    return next(error);
  }
};

const getRepliesByUser = async (req, res, next) => {
  const { id } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
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
    const total = await prisma.post.count({
      where: {
        userId: user.id,
        NOT: {
          parentPostId: null,
        },
        parentPost: {
          NOT: {
            userId: user.id,
          },
        },
      },
    });
    const replies = await prisma.post.findMany({
      where: {
        userId: user.id,
        NOT: {
          parentPostId: null,
        },
        parentPost: {
          NOT: {
            userId: user.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
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
        parentPost: {
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
          },
        },
      },
    });
    return res.status(200).json({
      info: {
        total,
        nextPage: total > (page - 1) * limit + replies.length ? page + 1 : null,
        prevPage: page === 1 ? null : page - 1,
      },
      results: replies,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUserByUsername,
  getPostsByUser,
  getLikedPostsByUser,
  followUser,
  unFollowUser,
  getFollowersList,
  getFolloweesList,
  getRepliesByUser,
};
