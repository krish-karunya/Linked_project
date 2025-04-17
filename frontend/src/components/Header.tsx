import { BellRing, House, LogOut, UserRoundPen, Users } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { BadgeInfo } from "lucide-react";
import { useAuthContext } from "../context/AuthUser";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { NotificationData } from "../pages/Notification";

const fetchNotificationData = () => {
  return axiosInstance.get("/notification/get");
};

const Header = () => {
  const { authUser, setAuthUser } = useAuthContext();

  // Notification data :
  const { data } = useQuery({
    queryKey: ["notification"],
    queryFn: fetchNotificationData,
  });

  // console.log(data?.data.data);

  let count = data?.data.data.reduce((acc: number, d: NotificationData) => {
    return !d.read ? acc + 1 : acc;
  }, 0);

  const handleClick = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      localStorage.removeItem("user");
      setAuthUser(null);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  return (
    <div className="p-3 bg-gray-100 flex justify-between items-center shadow-lg fixed w-full z-10 ">
      <div>
        <Link to={"/home"}>
          {" "}
          <img
            width="40"
            height="40"
            src="https://img.icons8.com/ios-filled/50/228BE6/linkedin.png"
            alt="linkedin"
          />
        </Link>
      </div>
      {authUser && (
        <div>
          <ul className="flex justify-center items-center gap-5 sm:gap-8">
            <li className=" text-[14px] font-semibold">
              <NavLink
                to={"/home"}
                className={({ isActive }) =>
                  `flex flex-col justify-center items-center ${
                    isActive ? "text-blue-500" : "text-gray-600"
                  }`
                }
              >
                {" "}
                <span>
                  <House className="size-6 md:size-5" />
                </span>{" "}
                <span className="hidden md:block">Home</span>
              </NavLink>
            </li>
            <li className=" text-[14px] font-semibold relative">
              <NavLink
                to={"/mynetwork"}
                className={({ isActive }) =>
                  `flex flex-col justify-center items-center  ${
                    isActive ? "text-blue-500" : "text-gray-600"
                  }`
                }
              >
                {" "}
                <span>
                  <Users className="size-6 md:size-5" />
                </span>{" "}
                <span className="hidden md:block"> My Network</span>
              </NavLink>
            </li>
            <li className=" text-[14px] font-semibold relative">
              <NavLink
                to={"/notification"}
                className={({ isActive }) =>
                  `flex flex-col justify-center items-center ${
                    isActive ? "text-blue-500" : "text-gray-600"
                  }`
                }
              >
                {" "}
                <span>
                  <BellRing className="size-6 md:size-5" />
                </span>{" "}
                <span className="hidden md:block"> Notification</span>
                <span
                  className="
                  absolute right-0 top-0 h-5 w-5 bg-blue-400 rounded-full text-white text-[10px] flex justify-center items-center 
        -translate-x-1/3 -translate-y-1/2 font-semibold"
                >
                  {count}
                </span>
              </NavLink>
            </li>
            <li className=" text-[14px] font-semibold">
              <NavLink
                to={"/profile"}
                className={({ isActive }) =>
                  `flex flex-col justify-center items-center ${
                    isActive ? "text-blue-500" : "text-gray-600"
                  }`
                }
              >
                {" "}
                <span>
                  <UserRoundPen className="size-6 md:size-5" />
                </span>
                <span className="hidden md:block"> My Profile</span>
              </NavLink>
            </li>
            <li>
              <button
                className="bg-blue-500 whitespace-nowrap  text-white px-4 py-2 rounded-full flex items-center gap-2 text-[12px] font-bold"
                onClick={handleClick}
              >
                <span>
                  <LogOut className="size-5" />
                </span>
                <span className="hidden md:block">Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      )}
      {!authUser && (
        <div className="flex justify-center items-center gap-8 mr-8">
          <p className="text-gray-600 flex justify-center items-center gap-1 text-[14px] hover:text-gray-800 font-semibold">
            {" "}
            <span>
              <BadgeInfo className="size-5" />
            </span>
            About us
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-[14px] font-semibold">
            Join Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
