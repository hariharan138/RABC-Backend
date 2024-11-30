const express = require('express');
const {
    register,
    login,
    addUser,
    getAllUsers,
    getSingleUser,
    editUser,
    deleteUser
} = require("../Controllers/User.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/add', addUser);
router.get('/', getAllUsers);
router.get('/:id', getSingleUser);
router.put('/:id', editUser);
router.delete('/:id', deleteUser);

module.exports = router;

