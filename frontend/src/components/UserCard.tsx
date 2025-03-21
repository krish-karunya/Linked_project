import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

const fetchProfileData = () => {
  return axiosInstance.get("/user");
};

const UserCard = () => {
  const { data } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchProfileData,
  });

  // console.log(data?.data.data);

  const user = data?.data.data;

  return (
    <div className="col-span-3 fixed w-[290px]">
      <div className=" p-1  rounded-lg bg-gray-200 relative">
        <div className="bg-gray-700 h-14 rounded-lg">
          <img
            src={user?.bannerImg}
            alt="banner-image"
            className="rounded-lg"
          />
        </div>
        <img
          src={user?.profilePic}
          alt="profilePic"
          className="rounded-full w-14 h-14 absolute top-8 left-5 object-cover mt-3"
        />

        <h1 className="mt-10 text-2xl font-semibold pl-4 mb-4">
          {user?.userName}
        </h1>
        <p className="text-[12px] w-[90%] ml-4">
          <span className="font-bold">About :</span>
          {user?.about}
        </p>
        <p className="p-4 text-[12px] ">
          <span className="font-bold mr-1">Location :</span>
          {user?.location}
        </p>
      </div>
      <div className="mt-2 bg-gray-200  rounded-lg flex flex-col justify-center gap-2 p-2">
        <p className="flex justify-between px-6 text-[12px]">
          Profile Viewers <span className="text-sky-400 font-semibold"> 5</span>
        </p>
        <p className="flex justify-between px-6 text-[12px]">
          Post impressions<span className="text-sky-400 font-semibold"> 9</span>
        </p>
      </div>
    </div>
  );
};

export default UserCard;
