const createError = require('http-errors');
const prisma = require('../services/connect-db');

const {
  NOTIFICATION_OBJECT_TYPE,
  NOTIFICATION_TYPE,
} = require('../utils/enums');

const createPost = async (req, res, next) => {
  const { userId } = req;
  const { content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    return res.status(201).json({ post });
  } catch (error) {
    return next(error);
  }
};

const likePost = async (req, res, next) => {
  const { postId } = req.body;
  const { userId } = req;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    const alreadyLiked = await prisma.like.findFirst({
      where: {
        postId: Number(postId),
        userId,
      },
    });
    if (alreadyLiked) {
      return res.status(201).json({ message: 'success' });
    }
    const likedPost = await prisma.like.create({
      data: {
        post: {
          connect: {
            id: Number(postId),
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        post: true,
      },
    });
    await prisma.notification.create({
      data: {
        senderId: userId,
        recipientId: post.userId,
        type: NOTIFICATION_TYPE.LIKE,
        objectType: NOTIFICATION_OBJECT_TYPE.POST,
        objectURI: post.id,
      },
    });
    return res.status(201).json({ post: likedPost });
  } catch (error) {
    return next(error);
  }
};

const unLikePost = async (req, res, next) => {
  const { postId } = req.body;
  const { userId } = req;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    await prisma.like.delete({
      where: {
        postId_userId: { postId: Number(postId), userId: Number(userId) },
      },
    });
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
};

const repostPost = async (req, res, next) => {
  const { postId } = req.body;
  const { userId } = req;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    const repost = await prisma.repost.create({
      data: {
        post: {
          connect: {
            id: Number(postId),
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        post: true,
      },
    });
    await prisma.notification.create({
      data: {
        senderId: userId,
        recipientId: post.userId,
        type: NOTIFICATION_TYPE.REPOST,
        objectType: NOTIFICATION_OBJECT_TYPE.POST,
        objectURI: post.id,
      },
    });
    return res.status(201).json({ post: repost });
  } catch (error) {
    return next(error);
  }
};

const removeRepost = async (req, res, next) => {
  const { postId } = req.body;
  const { userId } = req;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    await prisma.repost.delete({
      where: {
        postId_userId: { postId: Number(postId), userId: Number(userId) },
      },
    });
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
};

const postReply = async (req, res, next) => {
  const { postId, content } = req.body;
  const { userId } = req;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    const reply = await prisma.post.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
        parentPost: {
          connect: {
            id: postId,
          },
        },
      },
      include: {
        parentPost: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
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
    });
    await prisma.notification.create({
      data: {
        senderId: userId,
        recipientId: post.userId,
        type: NOTIFICATION_TYPE.REPLY,
        objectType: NOTIFICATION_OBJECT_TYPE.POST,
        objectURI: post.id,
      },
    });
    return res.status(201).json({ post: reply });
  } catch (error) {
    return next(error);
  }
};

const getPostById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
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
        reposts: true,
        replies: true,
        likes: true,
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
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    return res.status(200).json(post);
  } catch (error) {
    return next(error);
  }
};

const getAncestorPosts = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    let { parentPostId } = post;
    if (!parentPostId) return res.status(200).json(null);
    const posts = {};
    let HEAD = posts;
    while (parentPostId) {
      // eslint-disable-next-line no-await-in-loop
      const parentPost = await prisma.post.findUnique({
        where: {
          id: parentPostId,
        },
        include: {
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
          reposts: true,
          replies: true,
          likes: true,
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
      });
      HEAD.post = parentPost;
      parentPostId = parentPost.parentPostId;
      if (parentPostId) {
        HEAD.next = {};
        HEAD = HEAD.next;
      } else {
        HEAD.next = null;
      }
    }
    return res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
};

const getChildPosts = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!post) {
      const error = createError.NotFound();
      throw error;
    }
    const posts = await prisma.post.findMany({
      where: {
        parentPostId: post.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
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
        reposts: true,
        replies: true,
        likes: true,
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
    });
    return res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPost,
  likePost,
  unLikePost,
  repostPost,
  removeRepost,
  postReply,
  getPostById,
  getAncestorPosts,
  getChildPosts,
};
