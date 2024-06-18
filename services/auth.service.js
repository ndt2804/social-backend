const bcrypt = require("bcrypt");
const supabase = require("../libs/supabase");
async function registerUser(username, fullname, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!existingUser) {
      const { user, error } = await supabase.auth.signUp({
        email,
        password: hashedPassword,
      });

      if (error) {
        console.error("Error signing up:", error.message);
        throw new Error("Failed to register user");
      }

      const { data: insertedUsers, error: insertError } = await supabase
        .from("users")
        .insert([{ username, fullname, email, password: hashedPassword }])
        .select("*");
      if (insertError) {
        console.error("Error inserting user data:", insertError.message);
        throw new Error("Failed to insert user data into database");
      }
      return {
        message: "User registered successfully",
        user: insertedUsers,
      };
    } else {
      return { message: "Email is already registered" };
    }
  } catch (error) {
    console.error("Error registering user:", error.message);
    return { message: "Error registering user", error };
  }
}
async function loginUser(email, password) {
  try {
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!existingUser) {
      throw new Error("Email of user is not correct");
    }
    const isMatch = bcrypt.compareSync(password, existingUser.password);
    if (!isMatch) {
      throw new Error("Password of user is not correct");
    }

    if (error) {
      console.error("Error logging in:", error.message);
      throw new Error("Failed to log in user");
    }
    return {
      message: "User logged in successfully",
      existingUser,
    };
  } catch (error) {
    console.error("Error logging in:", error.message);
    return { message: "Error logging in", error };
  }
}
async function getUser() {}

module.exports = { registerUser, loginUser };
