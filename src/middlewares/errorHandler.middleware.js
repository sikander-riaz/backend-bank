import { IsApiError } from "../utils/ApiError.js";

const currentEnv = process.env.NODE_ENV || "development";

/**
 * Global error handler for all routes
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default function globalErrorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err);
  if (IsApiError(err)) return res.status(err.statusCode).send(err.message);
  if (currentEnv === "development") {
    console.error(err);
    return res.status(500).send(err.message);
  }
  console.error(err);
  return res.status(500).send("Something went wrong");
}
