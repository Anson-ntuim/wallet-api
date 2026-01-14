import limiter from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await limiter.limit(req.ip);
    if (!success) {
      return res.status(429).json({ message: "Too many requests" });
    } else {
      next();
    }
  } catch (error) {
    console.log("Error in rate limiter", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default rateLimiter;
