import * as Yup from "yup";
import User from "../models/User.js";
import { BadRequestError } from "../utils/ApiError.js";

const userController = {
  // SIGN UP (CREATE USER)

  add: async (req, res, next) => {
    console.log("REQ BODY:", req.body);
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .min(2, "Name must be at least 2 characters")
          .required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .matches(/[A-Z]/, "Must contain uppercase letter")
          .matches(/[a-z]/, "Must contain lowercase letter")
          .matches(/\d/, "Must contain a number")
          .matches(/[!@#$%^&*]/, "Must contain a special character")
          .required("Password is required"),
        phone_number: Yup.string()
          .matches(/^\d{10,15}$/, "Phone number must be 10-15 digits")
          .required("Phone number is required"),
      });

      // Validate full request and get all errors if any
      await schema.validate(req.body, { abortEarly: false });

      const { email } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) throw new BadRequestError("Email already exists");

      const user = await User.create(req.body);
      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
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

  // GET ALL USERS
  get: async (req, res, next) => {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  // GET USER BY ID
  find: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
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
        if (exists)
          return res.status(400).json({ error: "Email already in use" });
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: "Old password incorrect" });
      }

      const updateData = { ...req.body };
      if (password) updateData.password = password;

      const updatedUser = await user.update(updateData);
      return res.status(200).json(updatedUser);
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
