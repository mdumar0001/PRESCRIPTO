import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("DATABASE CONNECTED"));
  await mongoose.connect(`${process.env.MONGODB_URL}/prescripto`); //it will create a database prescripto in mongodb
};

export default connectDB;
