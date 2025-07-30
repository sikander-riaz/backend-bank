import * as Yup from "yup";
import User from "../models/User.js";
import { BadRequestError, ValidationError } from "../utils/ApiError.js";

const userController = {
  add: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(2).required("Name is required"),
        email: Yup.string().email().required("Email is required"),
        password: Yup.string()
          .min(8)
          .matches(/[A-Z]/, "Must contain uppercase")
          .matches(/[a-z]/, "Must contain lowercase")
          .matches(/\d/, "Must contain number")
          .matches(/[!@#$%^&*]/, "Must contain special character")
          .required("Password is required"),
        phone_number: Yup.string()
          .matches(/^\d{10,15}$/, "Invalid phone number")
          .required("Phone number is required"),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const { email } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) throw new BadRequestError("Email already exists");

      const user = await User.create(req.body);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  find: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw new BadRequestError("User not found");
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { email, oldPassword, password } = req.body;

      const user = await User.findByPk(req.userId);
      if (!user) throw new BadRequestError("User not found");

      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) throw new BadRequestError("Email already taken");
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        throw new UnauthorizedError("Old password incorrect");
      }

      const newData = { ...req.body };
      if (password) {
        newData.password = password;
      }

      const updatedUser = await user.update(newData);
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw new BadRequestError("User not found");

      await user.destroy();
      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
