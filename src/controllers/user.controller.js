import * as Yup from "yup";
import crypto from "crypto";
import User from "../models/User.js";
import { BadRequestError } from "../utils/ApiError.js";
import sendEmail from "../utils/sendEmail.js"; // 🔹 your nodemailer util
import jwt from "jsonwebtoken";

const userController = {
  // SIGN UP (CREATE USER + SEND VERIFICATION EMAIL)
  add: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(2).required(),
        email: Yup.string().email().required(),
        password: Yup.string()
          .min(8)
          .matches(/[A-Z]/)
          .matches(/[a-z]/)
          .matches(/\d/)
          .matches(/[!@#$%^&*]/)
          .required(),
        phone_number: Yup.string()
          .matches(/^\d{10,15}$/)
          .required(),
      });

      await schema.validate(req.body, { abortEarly: false });

      const { email, name } = req.body;
      const userExists = await User.findOne({ where: { email } });
      if (userExists) throw new BadRequestError("Email already exists");

      // 🔹 generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpire = new Date(Date.now() + 3600000); // 1h

      const user = await User.create({
        ...req.body,
        verificationToken,
        verificationTokenExpire,
      });

      // 🔹 Send email
      const verifyUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
      await sendEmail({
        to: email,
        subject: "Verify your account",
        html: `<h2>Hello ${name}</h2>
               <p>Please verify your account by clicking the link below:</p>
               <a href="${verifyUrl}">Verify Account</a>`,
      });

      return res.status(201).json({
        message: "User created. Verification email sent.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          acc_number: user.acc_number,
        },
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  },

  // VERIFY EMAIL
  verify: async (req, res, next) => {
    try {
      const { token } = req.params;
      const user = await User.findOne({ where: { verificationToken: token } });

      if (!user) return res.status(400).json({ error: "Invalid token" });
      if (user.verificationTokenExpire < new Date()) {
        return res.status(400).json({ error: "Token expired" });
      }

      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpire = null;
      await user.save();

      return res.status(200).json({ message: "Account verified successfully" });
    } catch (error) {
      next(error);
    }
  },

  // LOGIN (only if verified)
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "User not found" });

      if (!user.isVerified) {
        return res
          .status(401)
          .json({ error: "Please verify your email first" });
      }

      const validPassword = await user.checkPassword(password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          acc_number: user.acc_number,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET ALL USERS
  get: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          "id",
          "name",
          "email",
          "phone_number",
          "acc_number",
          "isVerified",
        ],
      });
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  // GET USER BY ID
  find: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: [
          "id",
          "name",
          "email",
          "phone_number",
          "acc_number",
          "isVerified",
        ],
      });
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  // UPDATE USER
  update: async (req, res, next) => {
    try {
      const { email, oldPassword, password } = req.body;
      const user = await User.findByPk(req.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (email && email !== user.email) {
        const exists = await User.findOne({ where: { email } });
        if (exists) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: "Old password incorrect" });
      }

      const updateData = { ...req.body };
      if (password) updateData.password = password;

      const updatedUser = await user.update(updateData);
      const { password_hash, ...safeUser } = updatedUser.get({ plain: true });

      return res.status(200).json(safeUser);
    } catch (error) {
      next(error);
    }
  },

  // DELETE USER
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      await user.destroy();
      return res.status(200).json({ message: "User deleted" });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
