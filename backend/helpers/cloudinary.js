const cloudinary = require('cloudinary').v2

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload to cloudinary
const uploadMediaCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            folder: 'LearnEdge',
        })

        return result
    } catch (error) {
        console.log(error);
        throw new Error('Error uploading to cloudinary')
    }
}

// Delete from cloudinary
const deleteMediaFromCloudinary = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        console.log(error);
        throw new Error('Error deleting from cloudinary')
    }
}

module.exports = {
    uploadMediaCloudinary,
    deleteMediaFromCloudinary
}
