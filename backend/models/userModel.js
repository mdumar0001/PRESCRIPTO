import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTgiIGhlaWdodD0iOTgiIHZpZXdCb3g9IjAgMCA5OCA5OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDkiIGN5PSI0OSIgcj0iNDkiIGZpbGw9IiNGNUY1RjUiLz4KPHBhdGggZD0iTTQ5LjEwMDggNDYuMTAwMUM1Mi40NDIyIDQ2LjEwMDEgNTUuMTUwOSA0My4zOTE0IDU1LjE1MDkgNDAuMDUwMUM1NS4xNTA5IDM2LjcwODcgNTIuNDQyMiAzNCA0OS4xMDA4IDM0QzQ1Ljc1OTUgMzQgNDMuMDUwOCAzNi43MDg3IDQzLjA1MDggNDAuMDUwMUM0My4wNTA4IDQzLjM5MTQgNDUuNzU5NSA0Ni4xMDAxIDQ5LjEwMDggNDYuMTAwMVoiIGZpbGw9IiNBQUFBQUEiLz4KPHBhdGggb3BhY2l0eT0iMC41IiBkPSJNNjEuMjAwMiA1Ny40NDNDNjEuMjAwMiA2MS4yMDIxIDYxLjIwMDIgNjQuMjQ5MyA0OS4xMDAxIDY0LjI0OTNDMzcgNjQuMjQ5MyAzNyA2MS4yMDIxIDM3IDU3LjQ0M0MzNyA1My42ODQgNDIuNDE3NCA1MC42MzY3IDQ5LjEwMDEgNTAuNjM2N0M1NS43ODI4IDUwLjYzNjcgNjEuMjAwMiA1My42ODQgNjEuMjAwMiA1Ny40NDNaIiBmaWxsPSIjQUFBQUFBIi8+Cjwvc3ZnPgo=",
  }, //whenever new user will be created then this default pic will be provided ,for this search image to base6 and go to the wevsite Base94 image encoder website
  address: { type: Object, default: { line1: "", line2: "" } },
  gender: { type: String, default: "Not Selected" },
  // dob: { type: String, default: "Not Selected" },
  dob: {
    type: String,
    default: () => new Date().toISOString().split("T")[0], // -> Current Date ko ISO string (YYYY-MM-DDTHH:mm:ssZ) me convert karta hai,-> "T" pe split karke sirf date part (YYYY-MM-DD) return karta hai,> Matlab hamesha user create hone wale din ki date dob me set hogi
  },
  phone: { type: String, default: "0000000000" },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
