import {
  registerUserService,
  loginUserService,
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
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
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
