// import { useQuery } from "@tanstack/react-query";
// import axios from "../utils/axiosInstance";
import UserCard from "../components/UserCard";
import FeedPost from "../components/FeedPost";
import UserSuggestion from "../components/UserSuggestion";
import { useAuthContext } from "../context/AuthUser";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Home = () => {
  const { authUser } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useQuery({
    queryKey: ["notification"],
  });

  return (
    <div>
      {isMenuOpen && (
        <div
          className="h-full w-full absolute bg-black z-10 opacity-50  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      <p className="py-2  text-xl ml-4">
        Welcome ,{" "}
        <span className=" text-sky-600 font-semibold text-2xl">
          {authUser?.data.userName}
        </span>
      </p>
      <div className="grid grid-cols-12 gap-2 p-2 mt-8 ">
        <UserCard />
        <FeedPost isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <UserSuggestion />
      </div>
    </div>
  );
};

export default Home;
