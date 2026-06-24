const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', protect, authorize('admin'), upload.single('image'), uploadImage);

module.exports = router;
