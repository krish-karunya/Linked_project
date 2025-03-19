import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axiosInstance";
import UserCard from "../components/UserCard";
import { Divide, Loader2Icon, Users } from "lucide-react";
type UserProps = {
  _id: string;
  userName: string;
  profilePic: string;
  headline: string;
};

const fetchMyNetworkConnection = () => {
  return axios.get("/connection/getall");
};
const MyNetwork = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myNetwork"],
    queryFn: fetchMyNetworkConnection,
  });
  // console.log(data?.data.data);
  const myConnectionList = data?.data.data;

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center mt-48">
        {<Loader2Icon className="animate-spin size-16" />}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-12 p-8 gap-6">
      <div className="col-span-4">
        <UserCard />
      </div>

      <div className="bg-gray-200 col-span-8 p-8">
        <h1 className="text-xl font-bold text-gray-700 mb-4">
          My Connections({myConnectionList.length})
        </h1>
        {myConnectionList.length == 0 ? (
          <div className="text-4xl font-bold text-gray-600 flex flex-col justify-center items-center mt-20 text-center">
            Select Connect from User Suggestion to create a connection{" "}
            <span className="mt-4">
              <Users size={90} />
            </span>
          </div>
        ) : (
          <div>
            {" "}
            {myConnectionList?.map((user: UserProps) => (
              <div
                key={user._id}
                className="bg-gray-300 px-4 py-6 rounded-lg flex items-center gap-4 justify-between mt-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.profilePic}
                    alt="profile-pic"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <h1 className="font-semibold">{user.userName}</h1>
                    <p className="text-sm text-gray-500">{user.headline}</p>
                  </div>
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-500">
                  Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNetwork;
