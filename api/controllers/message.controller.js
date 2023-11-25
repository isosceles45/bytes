import Message from "../models/message.model.js";
import jwt from "jsonwebtoken";

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) throw err;
        else {
          resolve(userData);
        }
      });
    } else {
      reject("No token provided");
    }
  });
}

export const messages = async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;

  const messages = await Message.find({
    sender: {$in: [userId, ourUserId]},
    recipient: {$in: [userId, ourUserId]},
  }).sort({ createdAt: 1 });
  res.json(messages);
};
