import * as Yup from "yup";
import User from "../models/User.js";
import JwtService from "../services/jwt.service.js";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError.js";

const loginController = {
  // LOGIN
  login: async (req, res, next) => {
    console.log("Login route HIT!");
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
      });

      // Validate with detailed errors
      await schema.validate(req.body, { abortEarly: false });

      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) throw new BadRequestError("Invalid email or password");

      const isValid = await user.checkPassword(password);
      if (!isValid) throw new UnauthorizedError("Invalid email or password");

      const token = JwtService.jwtSign(user.id);

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          acc_number: user.acc_number, // match your DB field
          balance: user.balance,
        },
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  },

  // LOGOUT
  logout: async (req, res, next) => {
    try {
      const token = JwtService.jwtGetToken(req);
      JwtService.jwtBlacklistToken(token);
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default loginController;
