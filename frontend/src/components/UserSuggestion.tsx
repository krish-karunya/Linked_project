import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { UserPlus, History } from "lucide-react";
import { useAuthContext } from "../context/AuthUser";

type UserProps = {
  _id: string;
  sender: Sender;
  receiver: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type Sender = {
  _id: string;
  userName: string;
  profilePic: string;
  headline: string;
};

type ProfileProps = {
  _id: string;
  userName: string;
  profilePic: string;
  headline: string;
};

const fetchSuggestedUser = () => {
  return axiosInstance.get("/user/suggestions");
};

const sendConnection = (userId: string) => {
  return axiosInstance.post(`/connection/send/${userId}`);
};

const acceptRequestFn = (connectionId: string) => {
  return axiosInstance.post(`/connection/accept/${connectionId}`);
};

const rejectRequestFn = (connectionId: string) => {
  return axiosInstance.post(`/connection/reject/${connectionId}`);
};

const getPendingConnection = () => {
  return axiosInstance.get("/connection/review");
};

const UserSuggestion = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthContext();
  // console.log(authUser);

  // Fetching the suggested User Data :
  const { data: suggestedUser } = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: fetchSuggestedUser,
  });

  // console.log(suggestedUser?.data.data);
  const suggestedUsers = suggestedUser?.data.data;

  // Function to send the connection request and invalid the suggested user :
  const { mutate } = useMutation({
    mutationFn: sendConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingConnection"] });
      console.log("Connection request send Successfully");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Accept Request Function :

  const { mutate: acceptFn } = useMutation({
    mutationFn: acceptRequestFn,
    onSuccess: () => {
      console.log("Accepted Successfully");
      queryClient.invalidateQueries({ queryKey: ["pendingConnection"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedUser"] });
    },
  });
  // Reject Request Function :

  const { mutate: rejectFn } = useMutation({
    mutationFn: rejectRequestFn,
    onSuccess: () => {
      console.log("Reject Successfully");
      queryClient.invalidateQueries({ queryKey: ["pendingConnection"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedUser"] });
    },
  });

  // Function to get the pending connection:
  const { data } = useQuery({
    queryKey: ["pendingConnection"],
    queryFn: getPendingConnection,
  });
  // console.log(data);
  const pendingConnectionList = data?.data.data;
  // console.log(pendingConnectionList);

  if (!pendingConnectionList) {
    return null;
  }

  return (
    <div className="col-span-3 bg-gray-200 p-4 rounded-lg h-[120vh]">
      {pendingConnectionList.find((user: UserProps) => {
        return (
          user.receiver === authUser?.data._id &&
          user.sender._id !== authUser?.data._id
        );
      }) ? (
        <div className="mb-2">
          <h1 className="font-semibold">Connection Request</h1>
          {pendingConnectionList.map(
            (user: UserProps) =>
              user.sender._id !== authUser?.data._id && (
                <div
                  className="mt-2 bg-gray-300 p-4 rounded-lg"
                  key={user.sender._id}
                >
                  <div className="flex items-start gap-4">
                    <div>
                      <img
                        src={user.sender.profilePic}
                        alt=""
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {user.sender.userName}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          className="px-2 py-1 rounded-lg bg-green-400 hover:bg-green-600 text-white text-sm font-semibold"
                          onClick={() => acceptFn(user._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="px-2 py-1 rounded-lg bg-red-400 hover:bg-red-600 text-white text-sm font-semibold"
                          onClick={() => rejectFn(user._id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      ) : (
        ""
      )}
      <p className="font-semibold text-sm mb-4">People You may Know</p>
      {suggestedUsers
        ?.filter((user: UserProps) =>
          pendingConnectionList.every(
            (con: UserProps) =>
              con.sender._id.toString() !== user._id.toString()
          )
        )
        .map((user: ProfileProps) => (
          <div
            className="bg-white  h-20 rounded-lg mt-2 flex  gap-3 px-4  justify-center items-center hover:bg-gray-100"
            key={user?._id}
          >
            <img
              src={user?.profilePic}
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-semibold  inline-block w-19 overflow-hidden ">
                {" "}
                {user?.userName}
              </span>
              <span className="text-[12px] text-gray-400 h-4 overflow-hidden">
                {user?.headline}
              </span>
            </div>
            <button
              className="text-[12px] border border-sky-700 text-sky-700 p-2 rounded-4xl font-bold flex justify-center items-center gap-1 px-4 hover:text-white hover:bg-sky-500 duration-300 "
              onClick={() => mutate(user._id)}
            >
              {pendingConnectionList?.find(
                (obj: UserProps) =>
                  obj.receiver === user._id && obj.status == "pending"
              ) ? (
                <span className="text-green-500 flex items-center gap-1">
                  <History />
                  pending
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <UserPlus />
                  connect
                </span>
              )}

              {/* <UserRoundPlus className="size-4" />
            Connect */}
            </button>
          </div>
        ))}
    </div>
  );
};

export default UserSuggestion;
