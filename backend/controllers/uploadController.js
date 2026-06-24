const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ind_location',
    });

    fs.unlink(req.file.path, () => {});

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage };
