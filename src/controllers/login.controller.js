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
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required("Email is required")
          .email("Invalid email"),
        password: Yup.string()
          .required("Password is required")
          .min(8, "Too short"),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      let { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) throw new BadRequestError();

      if (!(await user.checkPassword(password))) throw new UnauthorizedError();

      const token = JwtService.jwtSign(user.id);

      return res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));

      res.status(200).json({ msg: "Authorized" });
    } catch (error) {
      next(error);
    }
  },
};

export default loginController;
