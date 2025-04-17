import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { UserProfileProps } from "./FeedPost";
import { useQuery } from "@tanstack/react-query";
import notification from "../assets/notification.mp3";
import { MessageCircleMore } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { MessageformatRelativeTime } from "../utils/dateTimeFormatFunction";

interface Message {
  senderId: string;
  receiverId: string;
  userName: string;
  message: string;
  createdAt: string; // Ensure createdAt is included
}

const fetchMyNetworkConnection = () => {
  return axiosInstance.get("/connection/getall");
};

const Chat = () => {
  const [message, setMessage] = useState("");

  const [receivedMessage, setReceivedMessage] = useState<Message>([]);

  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data } = useQuery<UserProfileProps>({
    queryKey: ["userProfile"],
    // staleTime: Infinity,
  });
  // console.log(data);

  const user = data?.data.data;
  // console.log(user);

  const { data: myconnectionLists } = useQuery({
    queryKey: ["myNetwork"],
    queryFn: fetchMyNetworkConnection,
  });
  // console.log(data?.data.data);
  const myConnectionList = myconnectionLists?.data.data;
  // console.log(myConnectionList);

  const receiverInfo = myConnectionList?.filter((data: any) => data._id === id);
  // console.log(receiverInfo);
  const fetchMessageData: (id: string) => Promise<void> = async (
    id: string
  ) => {
    const response = await axiosInstance.get(`/message/${id}`);
    console.log(response.data);
    setReceivedMessage(response.data);
  };
  useEffect(() => {
    fetchMessageData(id ?? "");
  }, []);

  useEffect(() => {
    if (!user) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { receiverId: id, senderId: user?._id });

    socket.on(
      "receivedMessage",
      ({ senderId, receiverId, userName, message }) => {
        console.log(userName, "-", message);
        console.log(senderId, receiverId, userName, message);

        const userInfo = {
          senderId,
          receiverId,
          userName,
          message,
          createdAt: new Date().toISOString(),
        };
        console.log(userInfo);

        setReceivedMessage((prev) => [...prev, userInfo]);
        console.log(receivedMessage);
      }
    );
    scrollToBottom();

    return () => {
      socket.disconnect();
    };
  }, [user, id, receivedMessage]);

  //   scroll function to scroll the message at the end :
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessageData: (id: string) => Promise<void> = async (id: string) => {
    try {
      await axiosInstance.post(`/message/${id}`, { message });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length === 0) return null;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      receiverId: id,
      userName: user?.userName,
      senderId: user?._id,
      message,
    });
    const sound = new Audio(notification);
    sound.play();

    setMessage("");
    sendMessageData(id ?? "");
  };
  // console.log(receivedMessage);
  if (!receiverInfo) return;

  return (
    <div className="border border-sky-600 absolute w-[500px] left-[60px] lg:left-[300px] lg:w-[700px] h-[80%] mt-24 rounded-lg p-4">
      <div className="h-full flex flex-col justify-center px-4">
        <div className="flex items-center gap-4">
          <img
            src={receiverInfo[0]?.profilePic}
            alt="profile-pic"
            className="w-12 h-12 rounded-full"
          />
          <h1 className="font-semibold text-gray-900 text-xl">
            {" "}
            {receiverInfo[0]?.userName}
          </h1>
        </div>
        <hr className="mt-4" />
        <div className="flex-1 overflow-y-scroll">
          {receivedMessage.length === 0 && (
            <div className="flex flex-col items-center mt-20 gap-4">
              <MessageCircleMore className="h-20 w-80 text-sky-500" />
              <h1 className="text-3xl font-semibold text-gray-700">
                Send message to start your conversation
              </h1>
            </div>
          )}
          {receivedMessage.map((data: any, index: number) => (
            <div key={index}>
              <div className="flex-1">
                <div
                  className={`chat ${
                    user?._id === data.senderId ? "chat-start" : "chat-end"
                  } `}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src={
                          user?._id !== data.senderId
                            ? receiverInfo[0].profilePic
                            : user?.profilePic
                        }
                      />
                    </div>
                  </div>

                  <div
                    className={`chat-bubble  bg-gray-200 rounded-lg flex flex-col ${
                      user?._id !== data.senderId ? "bg-sky-500 text-white" : ""
                    }`}
                  >
                    {data.message}

                    <div className="chat-header ml-auto">
                      <time className="text-xs opacity-50">
                        {data?.createdAt &&
                        !isNaN(new Date(data.createdAt).getTime())
                          ? MessageformatRelativeTime(data.createdAt)
                          : "12.12"}
                      </time>
                    </div>
                  </div>
                  <div className="chat-footer opacity-50">Delivered</div>
                </div>
              </div>
              <div ref={messagesEndRef} />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-4 mt-4">
          <input
            type="text"
            className="flex-1 border-2 border-gray-300 outline-none rounded-lg py-1 px-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-sky-600 px-4 py-1 rounded-lg text-white font-semibold"
          >
            send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
