const prisma = require('../services/connect-db');

const getUserHomeFeed = async (req, res, next) => {
  const { userId } = req;
  const page = Number(req.query.page) || 1;
  const limit = 10;

  try {
    const postCount = await prisma.post.count({
      where: {
        parentPostId: null,
        user: {
          followedBy: {
            some: {
              id: userId,
            },
          },
        },
      },
    });

    const repostCount = await prisma.repost.count({
      where: {
        user: {
          followedBy: {
            some: {
              id: userId,
            },
          },
        },
      },
    });

    const total = postCount + repostCount;

    const posts = await prisma.post.findMany({
      where: {
        parentPostId: null,
        user: {
          followedBy: {
            some: {
              id: userId,
            },
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
      },
    });

    const reposts = await prisma.repost.findMany({
      where: {
        user: {
          followedBy: {
            some: {
              id: userId,
            },
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

module.exports = {
  getUserHomeFeed,
};
