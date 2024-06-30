import supabase from "../libs/supabase.js";
export async function followUserService(follower_id, following_id) {
    try {
        const { data: existingFollow } = await supabase
            .from('follow')
            .select('*')
            .eq('follower_id', follower_id)
            .eq('user_id', following_id)
            .single();
        if (existingFollow) {
            throw new Error('Already followed this user.');
        }

        const { data, error } = await supabase
            .from('follow')
            .insert([{ follower_id: follower_id, following_id: following_id }]);
        if (error) {
            throw error;
        }

        return { success: true };
    } catch (error) {
        console.error('Error in followUser:', error.message);
        throw error;
    }
}
