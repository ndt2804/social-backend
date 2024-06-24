import jwt from "jsonwebtoken";
import "dotenv/config";
const secretKey = process.env.SECRET_KEY;

export const auth = async (req, res, next) => {
  try {
    const cookie = req.headers.cookie;
    if (cookie) {
      const accessTokenMatch = cookie.match(/accessToken=([^;]*)/);
      const refreshTokenMatch = cookie.match(/refreshToken=([^;]*)/);
      const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
      const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null
      jwt.verify(accessToken, secretKey, (err, user) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Failed to authenticate token." });
        }
        req.user = user;
        next();
      });
    }
    if (!cookie) {
      return res.status(403).json({ message: "You do not have authorization" });
    }

  } catch (err) {
    console.log(err);
    res.status(401).send("Please authenticate");
  }
};
