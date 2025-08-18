import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  //lets create date format
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const navigate = useNavigate();
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + "" + months[Number(dateArray[1])] + "" + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/my-appointments",
        { headers: { token } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse()); //new appointment will be on top
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //cancel appointment function

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData(); //agar hum ise na late Appcontext se to appointment cancell karne pe apne aap update na hota slot i mean pura refresh krna padta kyunki appointment.jsx me hum doctors  appcontext se la rhe agar waha fecthc kar rhe hote to y profile page pe aate hi apne aap update ho jata
        //iski wajah se doctors array update ho jayega aur jaha bhi ui pe use ho rha re render hoga ya jaha bhi bheja gya ho jab ui pe ayega to updated hi render hoga
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const StripePayment = async (appointmentId) => {
    try {
      // const { data } = await axios.post(
      //   backendUrl + "/api/user/payment-razorpay",
      //   { appointmentId },
      //   { headers: { token } }
      // );
      // console.log(data);
      // if (data.success) {
      //   toast.success(data.message);
      //   getUserAppointments();
      //   navigate("/my-appointments");
      // } else {
      //   toast.error(data.message);
      const responsestripe = await axios.post(
        backendUrl + "/api/user/payment-stripe",
        { appointmentId },
        { headers: { token } }
      );
      if (responsestripe.data.success) {
        const { session_url } = responsestripe.data;
        window.location.replace(session_url); //we will send the user to this url
      } else {
        toast.error(responsestripe.data.message); //go to dummy payment stripe to get fake card number
      }
      // }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]); ///getuserappointment function fir se call hoga jab hum nye appointment book karenge appointment.jsx pe aur my-appointment.jsx pe ayenge to kyunki ye component unmoun hoke remount ho rha na ki re render
  //isliye my component list apne aap update ho ja rhi hai

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-neutral-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>
                {slotDateFormat(item.slotDate)}|{item.slotTime}
              </p>
            </div>
            <div>
              {/* we have aded this empty div so that buttons go to the right in mobile view */}
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                  Paid
                </button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => StripePayment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-indigo-500 hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-400 rounded">
                  Appointment Cancelled
                </button>
              )}
              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
