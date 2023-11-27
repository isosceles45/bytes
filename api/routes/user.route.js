import express from "express";
import {
  people,
  register,
  confirm,
  login,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirm", confirm);
router.get("/people", people);

export default router;
