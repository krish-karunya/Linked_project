import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { Pencil, Camera } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import { useState } from "react";

const ProfilePage = () => {
  const [edit, setEdit] = useState<boolean>(true);
  const { data, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => axiosInstance.get("/user"),
  });
  console.log(data?.data.data);
  const user = data?.data.data;
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="w-full text-gray-800 bg-gray-200 h-full relative">
      {edit && (
        <div
          className="h-full w-full absolute bg-black z-10 opacity-50  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100"
          onClick={() => setEdit(false)}
        ></div>
      )}
      <div className="relative border-2 border-gray-400 w-[60%] mx-auto rounded-t-lg ">
        <div>
          <img
            src={user.bannerImg}
            alt="banner-imgfile"
            className="h-50 mx-auto rounded-t-lg"
          />
          <div className=" rounded-full p-2">
            <Camera className="absolute right-6 size-10 bg-white rounded-full p-2 top-36" />
          </div>
        </div>
        <div>
          <img
            src={user.profilePic}
            alt="profile"
            className="w-36 h-36 object-cover rounded-full absolute top-28 left-10 border-4 border-gray-400 "
          />
          <div className=" rounded-full p-2">
            <Camera className="absolute left-36 size-10 bg-white rounded-full p-2" />
          </div>
        </div>

        <div className=" pl-8 bg-white  pb-4">
          <h1 className="text-3xl font-semibold pt-16">{user.userName}</h1>
          <p className="text-sky-500 font-semibold">5 connections</p>
          <p className="mt-2">
            {" "}
            <span className="font-semibold ">About :</span>
            {user.about}
          </p>
          <p>
            <span className="font-semibold">Location :</span>
            {user.location}
          </p>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl">About</h1>
            <span>
              <Pencil onClick={() => setEdit(true)} />
            </span>
          </div>
          <div className="mt-4 w-[90%] ml-4">{user.about}</div>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg ">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl">Profile URL</h1>
            <span>
              <Pencil onClick={() => setEdit(true)} />
            </span>
          </div>
          <div className="mt-4 w-[90%] ml-4 h-6 overflow-hidden">
            {user.bannerImg}
          </div>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg ">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl">Banner Image URL</h1>
            <span>
              <Pencil onClick={() => setEdit(true)} />
            </span>
          </div>
          <div className="mt-4 w-[90%] ml-4 h-6 overflow-hidden">
            {user.bannerImg}
          </div>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl">Experience</h1>
            <span>
              <Pencil onClick={() => setEdit(true)} />
            </span>
          </div>
          <div className="mt-4 w-[90%] ml-4">{user.about}</div>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl">Education</h1>
            <span>
              <Pencil onClick={() => setEdit(true)} />
            </span>
          </div>
          <div className="mt-4 w-[90%] ml-4">{user.about}</div>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl">Skills </h1>
            <span>
              <Pencil onClick={() => setEdit(true)} />
            </span>
          </div>
          <div className="mt-4 w-[90%] ml-4">
            {[
              "React",
              "React-router-dom",
              "Typescript",
              "Tanstack-Query",
              "React-Hook-Form",
              "Zod Library",
              "Zustand",
              "Redux",
              "context-API",
              "expressJs",
              "Nodejs",
              "MongoDB",
              "Eraser.io",
              "Draw.io",
            ].map((d) => (
              <button className="bg-gray-200 p-4 rounded-full m-1">
                {d}{" "}
                <span className="ml-3 text-[12px] rounded-full bg-white py-2 px-3 font-semibold">
                  X
                </span>
              </button>
            ))}
          </div>
        </div>

        <button className="mt-2 bg-sky-600 w-full p-2 text-white text-xl font-semibold rounded-full">
          Submit
        </button>
      </div>

      {edit && (
        <div>
          <ProfileForm setEdit={setEdit} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
