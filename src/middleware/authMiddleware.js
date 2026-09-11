import jsonWebToken from "jsonwebtoken";

function authMiddleWare(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please login to continue",
      });
    }
    const decodedToken = jsonWebToken.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
}
export default authMiddleWare;
