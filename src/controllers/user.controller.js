import * as Yup from "yup";
import User from "../models/User.js";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError.js";

// Yup is a JavaScript schema builder for value parsing and validation.

const userController = {
  add: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .min(2, "Name must be at least 2 characters")
          .required("Name is required"),
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .matches(/[A-Z]/, "Must contain at least one uppercase letter")
          .matches(/[a-z]/, "Must contain at least one lowercase letter")
          .matches(/\d/, "Must contain at least one number")
          .matches(/[!@#$%^&*]/, "Must contain at least one special character")
          .required("Password is required"),
        phone_number: Yup.string()
          .matches(/^\d{10,15}$/, "Phone number must be valid")
          .required("Phone number is required"),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const { email } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) throw new BadRequestError("User already exists");

      const user = await User.create(req.body);
      return res.status(200).json(user);
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
      if (!user) throw new BadRequestError();

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when("oldPassword", (oldPassword, field) =>
            oldPassword ? field.required() : field
          ),
        confirmPassword: Yup.string().when("password", (password, field) =>
          password ? field.required().oneOf([Yup.ref("password")]) : field
        ),
        phone_number: Yup.string().matches(/^\d{10,15}$/),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const { email, oldPassword } = req.body;
      const user = await User.findByPk(req.userId);

      if (email) {
        const userExists = await User.findOne({ where: { email } });
        if (userExists && userExists.id !== user.id)
          throw new BadRequestError("Email already taken");
      }

      if (oldPassword && !(await user.checkPassword(oldPassword)))
        throw new UnauthorizedError("Old password is incorrect");

      const newUser = await user.update(req.body);
      return res.status(200).json(newUser);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw new BadRequestError();

      await user.destroy();
      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
