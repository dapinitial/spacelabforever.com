const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyJWT = require('../../middleware/verifyJWT');

router.get('/users', verifyJWT, usersController.getAllUsers);
// .post(usersController.createNewUser)
// .patch(usersController.updateUser)
// .delete(usersController.deleteUser);

module.exports = router;