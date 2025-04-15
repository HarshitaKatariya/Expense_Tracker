const express = require('express');
const uploads = require('../middleware/uploadMiddle');
const userMiddle  = require('../middleware/authMiddleware'); // make sure to include this
const { User } = require('../model/user');

const router = express.Router();

router.post("/upload-image", userMiddle, uploads.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file was uploaded." });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profileImage: imageUrl },
            { new: true } // returns updated user
        ).select("-password");

        res.status(200).json({
            msg: "Image uploaded and user profile updated",
            user
        });
    } catch (e) {
        res.status(500).json({ message: "Error updating user", error: e.message });
    }
});


module.exports = router