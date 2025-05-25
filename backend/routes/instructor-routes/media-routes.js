const express = require('express')
const multer = require('multer')
const {uploadMediaCloudinary, deleteMediaFromCloudinary} = require('../../helpers/cloudinary')

const router = express.Router()
const upload = multer({dest: 'uploads/'});

router.post(
    '/upload',
    upload.single('file'),
    async (req, res) => {
      try {
        const result = await uploadMediaCloudinary(req.file.path);
        return res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.error("upload error:", error);
        return res.status(500).json({ success: false, message: 'Error uploading file' });
      }
    }
);  

router.delete('/delete/:id', async(req, res) => {
    try {
        const {id} = req.params

        if(!id) {
            return res.status(400).json({success: false, message: 'Asset Id required'})
        }

        await deleteMediaFromCloudinary(id)
        res.status(200).json({success: true, message: 'File deleted successfully from cloudinary'})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Error deleting file'})
    }
})

module.exports = router;
