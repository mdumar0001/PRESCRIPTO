import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);
  return (
    dashData && ( //overflow hidden na lagaye to jab koi dive zyada width hoga to uski wajah se dusra div bhi wide ho jayega aur sari available space le lega
      <div className=" m-5 overflow-hidden">
        <div className="flex  items-center gap-3 ">
          <div className="flex max-sm:flex-col max-sm:border max-sm:rounded-md items-center gap-2 bg-white p-4 min-w-52 max-sm:min-w-32 max-md:min-w-42  max-lg:rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl max-sm:text-center font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className=" text-gray-500">Doctors</p>
            </div>
          </div>
          <div className="flex max-sm:flex-col max-sm:border max-sm:rounded-md items-center gap-2 bg-white p-4 min-w-52 max-sm:min-w-34  max-md:min-w-42 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl max-sm:text-center font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>
          <div className="flex max-sm:flex-col max-sm:border max-sm:rounded-md items-center gap-2 bg-white p-4 min-w-52 max-sm:min-w-34  max-md:min-w-42 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl max-sm:text-center font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-500">Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white ">
          <div className="flex items-center  gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p>Latest Bookings</p>
          </div>
          <div className="pt-4 border  border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex  items-center m-2 px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.docData.image}
                  alt=""
                />
                <div className="flex-1  text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancell</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;

// import React, { useContext, useEffect } from "react";
// import { AdminContext } from "../../context/AdminContext";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";

// const Dashboard = () => {
//   const { aToken, getDashData, cancelAppointment, dashData } =
//     useContext(AdminContext);

//   const { slotDateFormat } = useContext(AppContext);

//   useEffect(() => {
//     if (aToken) {
//       getDashData();
//     }
//   }, [aToken]);
//   return (
//     dashData && (
//       <div className="ml-16 md:ml-64 p-2 md:p-5">
//         <div className="flex flex-col sm:flex-row items-center gap-3 overflow-x-auto pb-2">
//           <div className="flex items-center gap-2 bg-white p-3 sm:p-4 w-full sm:min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//             <img className="w-10 sm:w-14" src={assets.doctor_icon} alt="" />
//             <div>
//               <p className="text-lg sm:text-xl font-semibold text-gray-600">
//                 {dashData.doctors}
//               </p>
//               <p className="text-sm sm:text-base text-gray-500">Doctors</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 bg-white p-3 sm:p-4 w-full sm:min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//             <img
//               className="w-10 sm:w-14"
//               src={assets.appointments_icon}
//               alt=""
//             />
//             <div>
//               <p className="text-lg sm:text-xl font-semibold text-gray-600">
//                 {dashData.appointments}
//               </p>
//               <p className="text-sm sm:text-base text-gray-500">Appointments</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 bg-white p-3 sm:p-4 w-full sm:min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//             <img className="w-10 sm:w-14" src={assets.patients_icon} alt="" />
//             <div>
//               <p className="text-lg sm:text-xl font-semibold text-gray-600">
//                 {dashData.patients}
//               </p>
//               <p className="text-sm sm:text-base text-gray-500">Patients</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white mt-5 sm:mt-10">
//           <div className="flex items-center gap-2.5 px-3 sm:px-4 py-3 sm:py-4 rounded-t border">
//             <img className="w-5 sm:w-6" src={assets.list_icon} alt="" />
//             <p className="text-sm sm:text-base">Latest Bookings</p>
//           </div>
//           <div className="pt-2 sm:pt-4 border border-t-0">
//             {dashData.latestAppointments.map((item, index) => (
//               <div
//                 className="flex items-center px-3 sm:px-6 py-2 sm:py-3 gap-3 hover:bg-gray-100"
//                 key={index}
//               >
//                 <img
//                   className="rounded-full w-8 sm:w-10"
//                   src={item.docData.image}
//                   alt=""
//                 />
//                 <div className="flex-1 text-xs sm:text-sm">
//                   <p className="text-gray-800 font-medium">
//                     {item.docData.name}
//                   </p>
//                   <p className="text-gray-600">
//                     {slotDateFormat(item.slotDate)}
//                   </p>
//                 </div>
//                 {item.cancelled ? (
//                   <p className="text-red-400 text-xs font-medium">Cancell</p>
//                 ) : item.isCompleted ? (
//                   <p className="text-green-500 text-xs font-medium">
//                     Completed
//                   </p>
//                 ) : (
//                   <img
//                     onClick={() => cancelAppointment(item._id)}
//                     className="w-8 sm:w-10 cursor-pointer"
//                     src={assets.cancel_icon}
//                     alt=""
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default Dashboard;
