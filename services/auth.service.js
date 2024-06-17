const bcrypt = require("bcrypt");
const supabase = require("../libs/supabase");

// async function registerUser(username, fullname, email, password) {
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const { data: user } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email)
//       .single();
//     if (!user) {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password: hashedPassword,
//       });
//       if (error) {
//         console.error("Error signing up:", error.message);
//         throw new Error("Failed to register user");
//       }
//       const { data: user, error: insertError } = await supabase
//         .from("users")
//         .insert({ username, fullname, email });

//       if (insertError) {
//         console.error("Error inserting user data:", insertError.message);
//         throw new Error("Failed to insert user data into database");
//       }
//       console.log(user);
//       console.log(data);

//       return { message: "User registered successfully", user };
//     } else {
//       return { message: "Email is existing" };
//     }
//   } catch (error) {
//     return { message: "Error registering user", error };
//   }
// }
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
        .insert([{ username, fullname, email }])
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
async function loginUser() {}
async function getUser() {}

module.exports = { registerUser };
