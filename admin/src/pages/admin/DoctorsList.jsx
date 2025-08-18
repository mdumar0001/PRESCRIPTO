import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);
  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);
  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll flex flex-col items-center max-md:m-auto">
      <h1 className="text-lg font-medium">All Doctors</h1>
      {/* <div className="w-full  flex flex-wrap  gap-4 pt-5 gap-y-6 items-center"> */}{" "}
      <div className="w-full sm:p-8  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5 items-center ">
        {doctors &&
          doctors.map((item, index) => (
            <div
              className="border border-indigo-200 rounded-xl max-w-80  overflow-hidden cursor-pointer group"
              key={index}
            >
              <img
                className="bg-indigo-50 group-hover:bg-indigo-500 transition-all duration-500"
                src={item.image}
                alt=""
              />
              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">
                  {item.name}
                </p>
                <p className="text-zinc-600 text-sm">{item.speciality}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                  />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DoctorsList;

// import React, { useContext, useEffect } from "react";
// import { AdminContext } from "../../context/AdminContext";

// const DoctorsList = () => {
//   const { doctors, aToken, getAllDoctors, changeAvailability } =
//     useContext(AdminContext);

//   useEffect(() => {
//     if (aToken) {
//       getAllDoctors();
//     }
//   }, [aToken]);

//   return (
//     // <div className="m-5 max-h-[90vh] overflow-y-scroll">
//     <div className="w-full flex flex-wrap justify-center  ">
//       <h1 className="text-lg font-medium mt-6">All Doctors</h1>

//       {/* Full responsive grid + horizontal centering */}
//       <div className="w-full sm:p-8  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5 justify-items-center ">
//         {doctors &&
//           doctors.map((item, index) => (
//             <div
//               className="border border-indigo-200 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 w-full max-w-[260px] bg-white"
//               key={item._id}
//             >
//               <img
//                 className="bg-indigo-50 group-hover:bg-indigo-500 transition-all duration-500 w-full h-48 object-cover"
//                 src={item.image}
//                 alt={item.name}
//               />
//               <div className="p-4">
//                 <p className="text-neutral-800 text-lg font-medium truncate">
//                   {item.name}
//                 </p>
//                 <p className="text-zinc-600 text-sm truncate">
//                   {item.speciality}
//                 </p>
//                 <div className="mt-2 flex items-center gap-1 text-sm">
//                   <input
//                     onChange={() => changeAvailability(item._id)}
//                     type="checkbox"
//                     checked={item.available}
//                   />
//                   <p>Available</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default DoctorsList;
