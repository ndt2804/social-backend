import { addFriendService, requestFriendService, getFriendService, unfriendService } from "../services/friend.service.js";
export async function addFriend(req, res) {
    const { user_id_1, user_id_2, status, blocked } = req.body;
    try {
        const friend = await addFriendService(user_id_1, user_id_2, status, blocked);
        res.status(201).json(friend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Send friend request  failed" });
    }
}
export async function requestFriend(req, res) {
    try {
        const friend = await requestFriendService(req.headers.cookie);
        res.status(201).json(friend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get request friend failed" });
    }
}
export async function getFriend(req, res) {
    try {
        const friend = await getFriendService(req.headers.cookie);
        res.status(201).json(friend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Get  friend failed" });
    }
}
export async function unFriend(req, res) {
    const id = req.params.id
    const cookie = req.headers.cookie
    try {
        const result = await unfriendService(id, cookie);
        res.status(200).json({ message: 'Friend deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "delete  friend failed" });
    }
}