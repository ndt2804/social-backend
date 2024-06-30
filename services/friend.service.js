import supabase from "../libs/supabase.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

export async function addFriendService(user_id_1, user_id_2, status, blocked) {
    const { data: friendUser, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user_id_2)
        .single();
    if (error) {
        console.error("Error add friend in:", error.message);
        throw new Error("Failed add friend");
    }
    if (!friendUser) {
        throw new Error('Not User');
    }
    const { data: friend, error: friendError } = await supabase
        .from('friends')
        .insert([{ user_id_1: user_id_1, user_id_2: user_id_2, status: status, blocked: blocked }])
        .select();
    if (friendError) {
        console.error("Error add friend in:", friendError.message);
        throw new Error("Failed add friend");
    }
    return friend;
}

export async function requestFriendService(cookie) {
    try {
        const tokenMatch = cookie.match(/accessToken=([^;]*)/);
        const token = tokenMatch ? tokenMatch[1] : null;
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { data: friends, error } = await supabase
            .from("friends")
            .select("*")
            .eq("user_id_2", decoded.id)
            .eq("status", 2)
        if (error) {
            console.error("Error user in:", error.message);
            throw new Error("Failed user");
        }
        if (!friends) {
            throw new Error('Not User');
        }
        return friends;
    }
    catch (e) {
        throw new Error('Error when try get User');
    }
}

export async function getFriendService(cookie) {
    try {
        const tokenMatch = cookie.match(/accessToken=([^;]*)/);
        const token = tokenMatch ? tokenMatch[1] : null;
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { data: friends, error } = await supabase
            .from("friends")
            .select("*")
            .or(
                `user_id_1.eq.${decoded.id},user_id_2.eq.${decoded.id}`
            ).eq("status", 1)
        if (error) {
            console.error("Error user in:", error.message);
            throw new Error("Failed user");
        }
        if (!friends) {
            throw new Error('Not User');
        }
        return friends;
    }
    catch (e) {
        throw new Error('Error when try get User');
    }
}

export async function unfriendService(id, cookie) {
    try {
        const tokenMatch = cookie.match(/accessToken=([^;]*)/);
        const token = tokenMatch ? tokenMatch[1] : null;
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const { error } = await supabase
            .from('friends')
            .delete()
            .eq('user_id_2', decoded.id)
            .eq('user_id_1', id);
        if (error) {
            console.error("Error user in:", error.message);
            throw new Error("Failed user");
        }

        return { success: true };
    }
    catch (e) {
        throw new Error('Error when try get User');
    }
}