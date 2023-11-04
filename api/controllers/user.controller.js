import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const confirm = (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        res.json(userData);
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });

    jwt.sign(
      { userId: createdUser._id, username },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { secure: true, sameSite: "none" })
          .status(201)
          .json({
            id: createdUser._id,
          });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });

  if (foundUser) {
    const passOk = bcryptjs.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, { secure: true, sameSite: "none" })
            .status(201)
            .json({
              id: foundUser._id,
            });
        }
      );
    }
  }
};
