const NOTIFICATION_TYPE = Object.freeze({
  POST: 'post',
  REPOST: 'repost',
  REPLY: 'reply',
  LIKE: 'like',
  FOLLOW: 'follow',
});

const NOTIFICATION_OBJECT_TYPE = Object.freeze({
  POST: 'post',
  USER: 'user',
});

module.exports = {
  NOTIFICATION_TYPE,
  NOTIFICATION_OBJECT_TYPE,
};
