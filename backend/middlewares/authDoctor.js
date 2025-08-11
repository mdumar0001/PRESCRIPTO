import jwt from "jsonwebtoken";

//Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    // req.Doctor = token_decode.id;
    req.doctor = { id: token_decode.id };
    // req.body.DoctorId = token_decode.id; //we are adding Doctor id while login we can see

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
