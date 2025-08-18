import React, { useContext, useEffect } from "react";
// import { ShopContext } from "../context/shopContext";
import { AppContext } from "../context/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

//this is not a secure method to verify stripe payment ,we should use webhooks,but that will be long process so we use this instead
const Verify = () => {
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const success = searchParams.get("success");
  const appointmentId = searchParams.get("appointmentId");
  const sessionId = searchParams.get("sessionId");

  const veryfyPayments = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + "/api/user/verifyStripe",
        { success, appointmentId, sessionId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/my-appointments");
      } else {
        toast.error(response.data.message);
        navigate("/my-appointments");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    veryfyPayments();
  }, [token]);
  return <div></div>;
};

export default Verify;
