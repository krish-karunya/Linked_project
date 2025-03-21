import { useQuery } from "@tanstack/react-query";
import PostForm from "./PostForm";
import PostContainer from "./PostContainer";

export type UserProfile = {
  _id: string;
  userName: string;
  email: string;
  profilePic: string;
  bannerImg: string;
  headline: string;
  location: string;
  about: string;
  skill: any[];
  experience: any[];
  connections: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type UserProfileProps = {
  data: {
    data: UserProfile;
  };
};

type PostProp = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const Post = ({ isMenuOpen, setIsMenuOpen }: PostProp) => {
  const { data } = useQuery<UserProfileProps>({
    queryKey: ["userProfile"],
  });
  // console.log(data);

  const user = data?.data.data;

  if (!user) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="col-span-6  text-center w-full ml-[300px]">
      <PostForm
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        user={user}
      />
      <PostContainer />
    </div>
  );
};

export default Post;
