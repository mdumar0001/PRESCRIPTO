import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  //setDoctors app context se aa rha rerender ho ga change se(booappointment me run ho rha) evrything on ui se doctors array update,doctors dependecny array hai to uske change se fectDocinfo run ,jisse docinfo update so getavailale slot re run
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfweek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [docInfo, setDocInfo] = useState(null);

  const fetchDocInfo = async () => {
    const doctorsInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(doctorsInfo);
    // console.log(doctorsInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    //getting current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today);
      // console.log(currentDate);
      currentDate.setDate(today.getDate() + i);
      // console.log(currentDate);

      //setting end time of the date with index
      let endtime = new Date();
      // console.log(endtime);
      endtime.setDate(today.getDate() + i);
      endtime.setHours(21, 0, 0, 0);
      // console.log(endtime);
      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];
      while (currentDate < endtime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          // second: "2-digit",
        }); //toLocaleDateString not this
        // console.log(formattedTime);

        //well as we added the functionality of user to book slots so we have to hide perticular booked slots (timeslots) so that user does not click to book that booked slot
        //later we will add the functionality to cancell or unbook this slot

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        // docInfo.slots_booked?.[slotDate]?.includes(formattedTime);

        const isSlotAvailable =
          //docInfo && //beceause initially we are setting it null so checkin it first

          docInfo?.slots_booked[slotDate] &&
          docInfo?.slots_booked[slotDate].includes(slotTime)
            ? false
            : true; //if both are conditions true then isSlotAvailable will  be false that means slots are not available

        if (isSlotAvailable) {
          //add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // console.log(timeSlots);
        //Increment current tie by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  ////function to book appointment

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {
      //we sill store selected date in a variable
      const date = docSlots[slotIndex][0].datetime;

      //we will destructure this date so that we can store date month year in different variables

      let day = date.getDate();
      let month = date.getMonth() + 1; //because 0 indexed and index 0 is january
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      // console.log(slotDate);
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);
  useEffect(() => {
    //for more surity we check so that it  never set null docinfo before that can cause bug or not working correctly

    getAvailableSlots();
  }, [docInfo]);
  useEffect(() => {
    // console.log(docSlots);
  }, [docSlots]);

  if (docInfo) {
    return (
      <div>
        {/* ----doctors detail-------------- */}
        {docInfo && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <img
                className="bg-indigo-500 w-full sm:max-w-72 rounded-lg"
                src={docInfo.image}
                alt=""
              />
            </div>
            <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
              {/* --------Doc-info:name,degree,experience */}
              <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                {docInfo.name}
                <img className="w-5" src={assets.verified_icon} alt="" />
              </p>
              <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                <p>
                  {docInfo.degree} - {docInfo.speciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full">
                  {docInfo.experience}
                </button>
              </div>
              {/* --Doctos About------ */}
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                  About <img src={assets.info_icon} alt="" />
                </p>
                <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                  {docInfo.about}
                </p>
              </div>
              <p className="text-gray-500 font-medium mt-4">
                Appointment fee:{" "}
                <span className="text-gray-600">
                  {currencySymbol}
                  {docInfo.fees}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ------------------BOOKING SLOTS----- */}

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full  overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-indigo-500 text-white"
                      : "border border-gray-700"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfweek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-indigo-500 text-white"
                      : "text-gray-400 border border-gray-600"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-indigo-500 text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer"
          >
            Book an Appointment
          </button>
        </div>

        {/* ----Lsiting Related Docors-------- */}
        <RelatedDoctors
          docId={docId}
          speciality={docInfo && docInfo.speciality} //agar null na ho tabhi jaye
        />
      </div>
    );
  } else {
    return (
      <div className="text-blue-700 font-light text-md">
        loading please wait ...
      </div>
    );
  }
};

export default Appointment;
