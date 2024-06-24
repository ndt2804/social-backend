import { hash, compareSync } from "bcrypt";
import supabase from "../libs/supabase.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export async function registerUserService(username, fullname, email, password) {
  try {
    const hashedPassword = await hash(password, 10);
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

export async function loginUserService(email, password) {
  try {
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!existingUser) {
      throw new Error("Email of user is not correct");
    }
    const isMatch = compareSync(password, existingUser.password);
    if (!isMatch) {
      throw new Error("Password of user is not correct");
    }

    if (error) {
      console.error("Error logging in:", error.message);
      throw new Error("Failed to log in user");
    }

    const accessToken = jwt.sign(
      { id: existingUser.id },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY
    );
    return {
      message: "User logged in successfully",
      existingUser,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error logging in:", error.message);
    return { message: "Error logging in", error };
  }
}
export async function userService(user) {
  try {
    const tokenMatch = user.match(/accessToken=([^;]*)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error) {
      console.error("Error user in:", error.message);
      throw new Error("Failed user");
    }
    if (!existingUser) {
      throw new Error('Not User');
    }

    return existingUser;

  }
  catch (e) {
    throw new Error('Error when try get User');
  }
}
export async function getUserService(slug) {

  try {
    if (!slug) {
      throw new Error();
    }
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", slug)
      .single();
    if (error) {
      console.error("Error getUser in:", error.message);
      throw new Error("Failed getUser");
    }
    if (!user) {
      throw new Error('Not User');
    }

    return user;
  }
  catch (e) {
    throw new Error('Error when try get User');
  }
}
export async function changeUserNameService() {

}