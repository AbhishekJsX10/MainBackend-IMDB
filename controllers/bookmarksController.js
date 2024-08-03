
import  {User } from "../models/usersModel.js";

export const addbookMark = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId); // Changed from find to findById

        if (user.bookmarks.includes(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Bookmark already exists", // Corrected message
            });
        }

        user.bookmarks.push(id); // Corrected bookmarks spelling
        await user.save();

        res.status(200).json({
            success: true,
            message: "Bookmark added successfully", // Corrected message
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add bookmark' // Corrected message
        });
    }
};

// Changed method from find to findById to ensure single document return
export const removeBookmark = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId); // Changed from find to findById
        const bookmarkIndex = user.bookmarks.indexOf(id); // Changed variable name to bookmarkIndex

        if (bookmarkIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found", // Corrected message
            });
        }

        user.bookmarks.splice(bookmarkIndex, 1); // Corrected bookmarks spelling
        await user.save();

        res.status(200).json({
            success: true,
            message: "Bookmark removed successfully", // Corrected message
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove bookmark', // Corrected message
        });
    }
};

// Changed method from find to findById to ensure single document return
export const allBookmarked = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId); // Changed from find to findById
        res.status(200).json({
            success: true,
            data: user.bookmarks, // Corrected bookmarks spelling
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookmarks', // Corrected message
        });
    }
};












