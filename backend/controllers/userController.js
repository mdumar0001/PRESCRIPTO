import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appoitmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";
const currency = "inr";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// import razorpay from "razorpay";
//API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Detail" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" });
    }
    //validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" });
    }
    //hashing user password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = await userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ user: false, message: "User does not exits" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user profile data
const getProfile = async (req, res) => {
  try {
    // const { userId } = req.body;
    const userId = req.user.id;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    // console.log(name, phone, address, dob, gender);
    const userId = req.user.id;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender || !address) {
      return res.json({ success: false, message: "Data Missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    let updatedUser;

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { image: imageUrl },
        { new: true }
      );
      //Ye { new: true } option sirf return hone wale document pe effect karta hai, database me update to waise hi hota hai chahe aap { new: true } likho ya na likho.
      //Agar { new: true } likhoge → updatedUser me nayi dob milegi.
    } else {
      updatedUser = await userModel.findById(userId); // agar image nahi hai to latest user fetch
    }
    //updating in appointments only if it is available for that user
    const checkAppointment = await appoitmentModel.find({ userId });
    if (!checkAppointment || checkAppointment.length === 0) {
      //   if (!checkAppointment) Ye condition kabhi true nahi hogi, kyunki find() empty array return karega, aur [] truthy hota hai.
      return res.json({ success: true, message: "Info Updated" });
    }
    // Step 3: userData ko appointment me sync karo
    await appoitmentModel.updateMany(
      { userId: userId },
      { $set: { userData: updatedUser.toObject() } }
    );
    // agar{ $set: { updatedUser } } likh rahe ho, matlab appointment document me ek naya field updatedUser ban jayega.
    // Lekin tum chahte ho ki appointment ke andar jo userData object hai wahi update ho.
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.id;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    //checking for slots availability
    if (slots_booked[slotDate]) {
      //if this slotDate entry present then we check
      if (slots_booked[slotDate].includes(slotTime)) {
        //if the slotbooked already for this date as well as this perticular time for a doctor
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;
    //we are saving dacData in in appointment and we do not want to save slotsbooked so we are deleting it
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appoitmentModel(appointmentData);
    await newAppointment.save();

    //save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user appointments lists

const listAppointments = async (req, res) => {
  try {
    // const { userId } = req.body;
    const userId = req.user.id;
    const appointments = await appoitmentModel.find({ userId }); //bcoz we added userId in appointment model

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to cancell appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.id;
    const appointmentData = await appoitmentModel.findById(appointmentId);

    //verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appoitmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    //releasing doctor slot from doctorModel for  from this cancelled
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked; //copying

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to make payment of appointment using razorpay
// const razorpayInstance = new razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// }); //creating instance

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appoitmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: true,
        message: "Appointment cancelled or not found",
      });
    }
    await appoitmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
    });
    res.json({ success: true, message: "Payment Successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    // const { items, amount, address } = req.body;
    // const userId = req.user.id;
    //origin url from where user initiated the payments (frontend url) ie here localhost:5173
    const { appointmentId } = req.body;
    const appointmentData = await appoitmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: true,
        message: "Appointment cancelled or not found",
      });
    }
    const { origin } = req.headers;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr", // or "inr", etc.
            product_data: {
              name: "Appointment Payment",
            },
            unit_amount: appointmentData.amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      // success_url: `${origin}/verify?success=true&orderId=${appointmentId}`,
      // cancel_url: `${origin}/verify?success=false&orderId=${appointmentId}`,
      success_url: `${origin}/verify?success=true&appointmentId=${appointmentId}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentId}&sessionId={CHECKOUT_SESSION_ID}`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Verify Stripe
// const verifyStripe = async (req, res) => {
//   const { appointmentId, success } = req.body;
//   const userId = req.user.id;
//   try {
//     if (success === "true") {
//       // await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       // await userModel.findByIdAndUpdate(userId, { cartData: {} });
//       await appoitmentModel.findByIdAndUpdate(appointmentId, {
//         payment: true,
//       });
//       res.json({ success: true, message: "Payment Successful" });
//       // res.json({ success: true });
//     } else {
//       res.json({ success: false, message: "Payment Failed" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
const verifyStripe = async (req, res) => {
  const { appointmentId, success, sessionId } = req.body;
  const userId = req.user.id;
  console.log("paid stripe");
  try {
    if (success === "true") {
      // Stripe se confirm karo
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        await appoitmentModel.findByIdAndUpdate(appointmentId, {
          payment: true,
        });

        return res.json({ success: true, message: "Payment Successful" });
      } else {
        return res.json({ success: false, message: "Payment not completed" });
      }
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to verify payment of razorpay
// const verifyRazorpay = async (req, res) => {
//   try {
//     // const { raorpay_order_id } = req.body;ks
//     const { order_id, payment_id } = req.body;
//     // const orderInfo = await razorpayInstance.orders.fetch(raorpay_order_id);

//     // console.log(orderInfo);
//     // if (orderInfo.status === "paid") {
//     //   await appoitmentModel.findByIdAndUpdate(orderInfo.receipt, {
//     //     payment: true,
//     //   });
//     //   res.json({ success: true, message: "Payment Successful" });
//     // } else {
//     //   res.json({ success: false, message: "Payment Failed" });
//     // }
//     res.json({
//       success: true,
//       message: "Payment Successful",
//       order_id,
//       payment_id,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentRazorpay,
  placeOrderStripe,
  verifyStripe,
};
