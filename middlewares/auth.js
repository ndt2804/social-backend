import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import "dotenv/config";
const secretKey = process.env.SECRET_KEY;

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(403).json({ message: "You do not have authorization" });
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Failed to authenticate token." });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(401).send("Please authenticate");
  }
};
