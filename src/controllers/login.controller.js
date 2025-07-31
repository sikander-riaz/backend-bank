import * as Yup from "yup";
import User from "../models/User.js";
import JwtService from "../services/jwt.service.js";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError.js";

const loginController = {
  login: async (req, res, next) => {
    console.log("🚀 Login route HIT!");
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required("Email is required"),
        password: Yup.string().min(8).required("Password is required"),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) throw new BadRequestError("Invalid email or password");

      const valid = await user.checkPassword(password);
      if (!valid) throw new UnauthorizedError("Invalid email or password");

      const token = JwtService.jwtSign(user.id);

      return res.status(200).json({
        message: "Login successful",
        userId: user.id,
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));
      return res.status(200).json({ message: "Logged out" });
    } catch (error) {
      next(error);
    }
  },
};

export default loginController;
