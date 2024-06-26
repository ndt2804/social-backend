import {
  registerUserService,
  loginUserService,
  userService,
  getUserService,
  updateUserService,
  changePasswordUserService,
  updatePasswordService,
  resetPasswordService,
  checkEmailService
} from "../services/auth.service.js";

export async function registerUser(req, res) {
  const { username, fullname, email, password } = req.body;
  try {
    const user = await registerUserService(username, fullname, email, password);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function logInUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await loginUserService(email, password);
    res.cookie('accessToken', user.accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', user.refreshToken, { httpOnly: true, secure: true });
    res.status(201).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await userService(req.headers.cookie);
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send((error));
  }
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    if (!refreshToken.includes(refreshToken)) {
      return res.sendStatus(403);
    }
    res.status(201).json(refreshToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function updateUser(req, res) {
  const { username, fullname, email } = req.body;

  try {
    const user = await updateUserService(req.params.slug, username, fullname, email);
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send((error));
  }
}
export async function getUser(req, res) {
  try {
    const user = await getUserService(req.params.slug);
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send((error));
  }
}
export async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await changePasswordUserService(req.params.slug, oldPassword, newPassword);
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send((error));
  }
}

export async function verifyEmail(req, res) {
  const { email, token } = req.query;

  if (checkEmailService(email, token)) {
    res.status(200).json({ message: 'Token hợp lệ. Vui lòng cập nhật mật khẩu.' });
  } else {
    res.status(400).json({ error: 'Token không hợp lệ.' });
  }
}
export async function updatePassword(req, res) {
  const { email, token } = req.query;
  const { password } = req.body;

  try {
    const result = await updatePasswordService(email, password);
    res.status(200).send(result);
  } catch (error) {
    return res.status(500).send((error));
  }
}

export async function resetPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await resetPasswordService(email);
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send((error));
  }
}
