import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/axiosInstance";
import {
  Check,
  EyeIcon,
  Loader2Icon,
  MessageCircle,
  ThumbsUp,
  Trash,
  UserPlus,
} from "lucide-react";
import { Default_user_img } from "../utils/constant";
import axiosInstance from "../utils/axiosInstance";
import { formatRelativeTime } from "../utils/dateTimeFormatFunction";
import { Link } from "react-router-dom";

type NotificationType = "like" | "comment" | "connection" | "Accepted";

export type NotificationData = {
  _id: string;
  postId: PostID;
  content: string;
  notificationType: NotificationType;
  read: boolean;
  senderId: SenderID;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type PostID = {
  _id: string;
  content: string;
  image: string;
};

type SenderID = {
  _id: string;
  userName: string;
  profilePic: string;
};

const fetchNotificationData = () => {
  return axios.get("/notification/get");
};

const editRead = (notificationId: string) => {
  return axiosInstance.post(`notification/read/${notificationId}`);
};
const deleteRead = (notificationId: string) => {
  return axiosInstance.delete(`notification/delete/${notificationId}`);
};
const Notification = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notification"],
    queryFn: fetchNotificationData,
  });
  // console.log(data?.data.data);

  const notificationList = data?.data.data;
  const queryClient = useQueryClient();

  const renderNotificationIcon = (notificationType: NotificationType) => {
    switch (notificationType) {
      case "comment":
        return (
          <p>
            <MessageCircle className="text-green-500 size-10" />
          </p>
        );
      case "like":
        return (
          <p>
            <ThumbsUp className="text-sky-500 size-10" />{" "}
          </p>
        );
      case "connection":
        return (
          <p>
            <UserPlus className="text-sky-500 size-10" />
          </p>
        );
      case "Accepted":
        return (
          <p>
            <UserPlus className="text-sky-500 size-10" />
          </p>
        );
      default:
        null;
    }
  };

  const renderNotificationContent = (notification: NotificationData) => {
    switch (notification.notificationType) {
      case "comment":
        return (
          <div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-bold">
                  {notification.senderId.userName}
                </span>{" "}
                is Commented on your Post
              </p>
              <span className="text-gray-500">
                {formatRelativeTime(notification.createdAt)}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <img
                src={notification.postId.image}
                alt="post-image"
                className="w-12 h-12 rounded-lg"
              />
              <p>
                {" "}
                <div>
                  <span className="font-semibold "> Comment:</span>{" "}
                  {notification.content || "default Comment"}
                </div>
                <div className="flex items-center gap-2">
                  {" "}
                  {/* <span className="font-bold">Shiva </span>{" "} */}
                  <p className="text-sm">
                    <span className="text-sky-500 hover:underline ml-2 mr-1">
                      <Link to={``}> Click here</Link>
                    </span>
                    To view the full comment
                  </p>
                </div>
              </p>
            </div>
          </div>
        );
      case "like":
        return (
          <div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-bold">
                  {notification.senderId.userName}
                </span>{" "}
                Like your Post
              </p>
              <span className="text-gray-500">
                {" "}
                {formatRelativeTime(notification.createdAt)}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <img
                src={notification.postId.image}
                alt="post-image"
                className="w-12 h-12 rounded-lg"
              />
              <div className="flex items-center gap-2">
                {" "}
                {/* <span className="font-bold">Shiva </span>{" "} */}
                <p className="text-sm">
                  To See the post{" "}
                  <span className="text-sky-500 hover:underline">
                    Click here
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      case "connection":
        return (
          <div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-bold">
                  {notification.senderId.userName}
                </span>{" "}
                send a connection Request
              </p>
              <span className="text-gray-500">
                {" "}
                {formatRelativeTime(notification.createdAt)}
              </span>
            </div>
          </div>
        );
      case "Accepted":
        return (
          <div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-bold">
                  {notification.senderId.userName}
                </span>{" "}
                Accepted the connection Request
              </p>
              <span className="text-gray-500">
                {" "}
                {formatRelativeTime(notification.createdAt)}
              </span>
            </div>
          </div>
        );
      default:
        null;
    }
  };
  const { mutate: HandleRead } = useMutation({
    mutationFn: editRead,
    onSuccess: () => {
      console.log("marked as Read");

      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
  });
  const { mutate: HandleDelete } = useMutation({
    mutationFn: deleteRead,
    onSuccess: () => {
      console.log("Notification Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
  });
  if (isError) {
    return <p>{error.message}</p>;
  }

  if (isLoading) {
    return <Loader2Icon className="animate-spin mx-auto size-20 mt-24" />;
  }

  return (
    <div className="p-8 w-full md:w-8/12 mx-auto text-gray-600">
      <div className="mt-16">
        {notificationList.length !== 0 && (
          <h1 className="text-2xl text-gray-700 font-semibold">
            Notification Details :
          </h1>
        )}

        {notificationList.length === 0 && (
          <div className="text-5xl font-bold text-gray-600 text-center mt-20">
            {" "}
            No notifications yet. Check back later!{" "}
          </div>
        )}

        {notificationList?.map((d: NotificationData) => (
          <div key={d.__v}>
            {!d.read && (
              <div className="w-full border-2 border-sky-500  rounded-lg flex items-center py-4 mt-2">
                <img
                  src={Default_user_img}
                  alt=""
                  className="w-20 h-20 rounded-full"
                />
                <div className="flex gap-2 ml-4 justify-between w-full pr-8">
                  <div className="flex gap-2">
                    {" "}
                    <div> {renderNotificationIcon(d.notificationType)}</div>
                    <div className="flex items-center mt-2">
                      {renderNotificationContent(d)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {d.read ? (
                      <Check className="text-green-600 font-bold" />
                    ) : (
                      <EyeIcon
                        className="hover:text-sky-600"
                        onClick={() => HandleRead(d._id)}
                      />
                    )}
                    <Trash
                      className="hover:text-red-500"
                      onClick={() => HandleDelete(d._id)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h1 className="text-2xl text-gray-800 font-semibold">History :</h1>
        {notificationList?.map((d: NotificationData) => (
          <div>
            {d.read && (
              <div className="w-full border-2 border-sky-500  rounded-lg flex items-center py-4 mt-2">
                <img
                  src={Default_user_img}
                  alt=""
                  className="w-20 h-20 rounded-full"
                />
                <div className="flex gap-2 ml-4 justify-between w-full pr-8">
                  <div className="flex gap-2">
                    {" "}
                    <div> {renderNotificationIcon(d.notificationType)}</div>
                    <div className="flex items-center mt-2">
                      {renderNotificationContent(d)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {d.read === true ? (
                      <Check className="text-green-600 font-bold" />
                    ) : (
                      <EyeIcon
                        className="hover:text-sky-600"
                        onClick={() => HandleRead(d._id)}
                      />
                    )}
                    <Trash
                      className="hover:text-red-500"
                      onClick={() => HandleDelete(d._id)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
