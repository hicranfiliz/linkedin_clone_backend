const express = require('express');

const router = express.Router();
const generalController = require('../controllers/generalControllers');

// we import multer beacuse we store evertything in memory not in the file system..
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.route('/getPosts',generalController.getAllPosts);
router.route('/createPost',upload.single('image'), generalController.CreatePost);

router.post('/register',generalController.handleRegister);
router.post('/login',generalController.handleLogin);

module.exports = router;