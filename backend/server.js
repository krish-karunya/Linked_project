import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import { limiter } from "./utils/rateLimit.js";
import cors from "cors";

// Router:
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import connectionRoute from "./routes/connection.route.js";
import notificationRoute from "./routes/notification.route.js";

// creating a instance of express :
const app = express();

// creating a config to access .env file :
dotenv.config();

// MiddleWare :
// app.use(limiter); // Apply the rate limiter to all routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser()); // To parse the value from cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // To Avoid the cors Error

// Routes :
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/connection", connectionRoute);
app.use("/api/v1/notification", notificationRoute);

// Connecting the DB Before Listening to the Port(Best Practice):
connectDB()
  .then(() => {
    console.log("mongodb connected Successfully");
    const PORT = process.env.PORT || 3000;
    // Server Listening Port :
    app.listen(PORT, () => {
      console.log("server is running in the port -", PORT);
    });
  })
  .catch((err) => {
    console.log("Error in mongoDB connection");
    process.exit(1);
  });
