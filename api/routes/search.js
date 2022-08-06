const router = require('express').Router();

const searchController = require('../controllers/search');
const { isAuthenticated } = require('../middlewares/auth');

router.get(
  '/users/by/username/:username',
  isAuthenticated,
  searchController.searchUsersByUsername
);
router.get(
  '/users/by/name/:name',
  isAuthenticated,
  searchController.searchUsersByName
);

module.exports = router;
