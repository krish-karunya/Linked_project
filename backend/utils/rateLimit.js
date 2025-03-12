import rateLimit from "express-rate-limit";

//Rate Limiter :
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
  headers: true, // include rate limit info in response headers
});
