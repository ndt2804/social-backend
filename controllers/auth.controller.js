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

async function logInUser(res, req) {
  const { username, fullname, email, password } = req.body;
  try {
    const user = await registerUser(username, fullname, email, password);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
}

module.exports = {
  registerUser,
  logInUser,
};
