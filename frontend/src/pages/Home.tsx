// import { useQuery } from "@tanstack/react-query";
// import axios from "../utils/axiosInstance";
import UserCard from "../components/UserCard";
import FeedPost from "../components/FeedPost";
import UserSuggestion from "../components/UserSuggestion";
import { useAuthContext } from "../context/AuthUser";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { authUser } = useAuthContext();
  useQuery({
    queryKey: ["notification"],
  });

  return (
    <div>
      <p className="py-2  text-xl ml-4">
        Welcome ,{" "}
        <span className=" text-sky-600 font-semibold text-2xl">
          {authUser?.data.userName}
        </span>
      </p>
      <div className="grid grid-cols-12 gap-2 p-2 ">
        <UserCard />
        <FeedPost />
        <UserSuggestion />
      </div>
    </div>
  );
};

export default Home;
