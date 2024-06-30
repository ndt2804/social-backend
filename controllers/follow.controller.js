import { followUserService } from '../services/follow.service.js';
export async function followUser(req, res) {
    const { follower_id, following_id } = req.body;


    try {
        const result = await followUserService(follower_id, following_id);
        res.status(200).json({ message: 'Successfully followed user.' });
    } catch (error) {
        console.error('Error in followUserController:', error.message);
        res.status(500).json({ error: 'Failed to follow user.' });
    }
}