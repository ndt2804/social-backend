import { hash, compareSync } from "bcrypt";
import supabase from "../libs/supabase.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from 'nodemailer'

export async function registerUserService(username, fullname, email, password) {
  try {
    const hashedPassword = await hash(password, 10);
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (!existingUser) {
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
      { id: existingUser.id },
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
export async function refreshTokenService(cookie) {
  try {
    const refreshTokenMatch = cookie.match(/refreshToken=([^;]*)/);
    const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;
    if (!refreshToken) {
      throw new Error();
    }
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
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
    const newToken = jwt.sign(
      { id: existingUser.id },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }

    );
    return {
      message: "New Token",
      newToken,
    };
  } catch (error) {
    console.error("Error refresh token in:", error.message);
    return { message: "Error refresh token in", error };
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
export async function updateUserService(slug, username, fullname, email) {
  try {
    if (!slug) {
      throw new Error();
    }
    const { data: user, error } = await supabase
      .from('users')
      .update({ username: username, fullname: fullname, email: email })
      .eq('username', slug)
      .select()
    if (error) {
      console.error("Error change user in:", error.message);
      throw new Error("Failed update user");
    }
    if (!user) {
      throw new Error('Not User');
    }

    return user;
  }
  catch (e) {
    throw new Error('Error when update User');
  }

}
export async function changePasswordUserService(slug, oldPassword, newPassword) {
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
      console.error("Error change user in:", error.message);
      throw new Error("Failed update user");
    }
    if (!user) {
      throw new Error('Not User');
    }
    const isMatch = compareSync(oldPassword, user.password);
    if (isMatch) {
      const hashNewPassword = await hash(newPassword, 10);

      const { data: updatePasswordUser } = await supabase
        .from('users')
        .update({ password: hashNewPassword })
        .eq('username', slug)
        .select()
      return {
        message: "User change password successfully",
        updatePasswordUser,
      };
    }
    throw new Error("Old password of user is not correct");
  }
  catch (e) {
    throw new Error('Error when update User');
  }

}
export async function checkEmailService(email, token) {
  const isMatch = compareSync(email, token);
  if (!isMatch) {
    throw new Error("Email of user is not correct");
  }
  return {
    success: true,
    message: "Email và token khớp nhau",
  };

}
export async function updatePasswordService(email, password) {
  const hashNewPassword = await hash(password, 10);
  const { data: updatePasswordUser } = await supabase
    .from('users')
    .update({ password: hashNewPassword })
    .eq('email', email)
    .select()
  return {
    message: "User change password successfully",
    updatePasswordUser,
  };
}
export async function resetPasswordService(email) {
  const hashEmail = await hash(email, 10);
  const data = await emailServices(email, hashEmail);
  return data;
}

export const emailServices = async (email, hashEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD_MAIL,
    },
  });
  const resetPasswordHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
  </head>
  <body>
    <p>Dear User,</p>
    <p>You have requested a password reset for your account.</p>
    <p>If you did not make this request, you can safely ignore this email.</p>
    <p>To proceed with the password reset, please click the button below:</p>
    <p><a href="http://localhost:2080/updatePassword?email=${email}&token=${hashEmail}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#ffffff;text-decoration:none;border-radius:5px;">Reset Password</a></p>
    <p>If the button above does not work, you can also copy and paste the following link into your browser's address bar:</p>
    <p>http://localhost:2080/updatePassword?email=${email}&token=${hashEmail}</p>
    <p>Thank you,</p>
    <p>Your Website Team</p>
  </body>
  </html>
`;
  transporter.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('[SUCCESS] - Nodemailer');
    }
  });
  const info = await transporter.sendMail({
    from: '"Aoi Fuuka" <networking.ved@gmail.com>',
    to: email,
    subject: "Reset Password",
    text: "Hello world?",
    html: resetPasswordHTML,
  });
  return info

} 