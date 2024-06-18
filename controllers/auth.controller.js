const registerUserServices = require("../services/auth.service");

async function registerUser(req, res) {
  const { username, fullname, email, password } = req.body;
  try {
    const user = await registerUserServices.registerUser(
      username,
      fullname,
      email,
      password
    );
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
}

async function logInUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await registerUserServices.loginUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
}

module.exports = {
  registerUser,
  logInUser,
};
