const router = require('express').Router();

const userController = require('../controllers/user');

router.get('/:username', userController.getUserByUsername);

module.exports = router;
