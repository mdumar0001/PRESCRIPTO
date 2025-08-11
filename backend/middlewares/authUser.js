import jwt from "jsonwebtoken";

//User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // req.user = token_decode.id;
    req.user = { id: token_decode.id };
    // req.body.userId = token_decode.id; //we are adding user id while login we can see

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
