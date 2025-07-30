import jwt from "jsonwebtoken";

const cookieOption = {
  maxAge: 2 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

const sendToken = (user, status, res, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  return res.status(status).cookie("token", token, cookieOption).json({
    success: true,
    message,
  });
};

export { sendToken, cookieOption };
