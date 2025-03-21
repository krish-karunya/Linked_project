import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../utils/schemaValidation";
import { z } from "zod";
import axiosInstance from "../utils/axiosInstance";
import { useAuthContext } from "../context/AuthUser";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";

// type FormDataShape = { userName: string; email: string; password: string };

// Main advantage of using Zod :
type FormValue = z.infer<typeof signupSchema>;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValue>({
    resolver: zodResolver(signupSchema),
  });

  const { authUser, setAuthUser } = useAuthContext();

  const HandleSubmit = async (data: FormValue) => {
    setLoading(true);
    // console.log(data);
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      // console.log(response);
      localStorage.setItem("user", JSON.stringify(response.data));

      setAuthUser(response.data);
      // console.log(authUser);
      toast.success(response.data.message);

      reset();
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  // console.log(errors);

  return (
    <div className="py-20">
      <div className="flex justify-center items-center p-4 gap-12">
        <div className="w-full md:w-1/2  rounded-lg ml-16 ">
          <h1 className="text-center text-3xl mr-20 mb-2 text-blue-700 font-semibold">
            Sign Up
          </h1>
          <form
            onSubmit={handleSubmit(HandleSubmit)}
            className=" w-[80%] p-4 rounded-lg flex flex-col justify-center shadow-xl bg-gray-100"
          >
            <h1 className="text-3xl text-red-900 mb-4">
              Welcome to our professional Community
            </h1>
            <div>
              <label htmlFor="userName" className="text-sm text-gray-500">
                UserName
              </label>
              <input
                type="text"
                className="w-full border border-gray-500 py-1 px-2"
                id="userName"
                {...register("userName")}
              />
            </div>
            <p className="text-[12px] text-red-400">
              {errors.userName?.message}
            </p>

            <div>
              <label htmlFor="email" className="text-sm text-gray-500">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-500 py-1 px-2"
                id="email"
                {...register("email")}
              />
            </div>
            <p className="text-[12px] text-red-400">{errors.email?.message}</p>

            <div>
              <label htmlFor="password" className="text-sm text-gray-500">
                password
              </label>
              <input
                type="password"
                className="w-full border border-gray-500 py-1 px-2"
                id="password"
                {...register("password")}
              />
            </div>
            <p className="text-[12px] text-red-400">
              {errors.password?.message}
            </p>

            <button className="w-full flex justify-center items-center py-2 mt-8 bg-blue-600 rounded font-semibold text-white hover:bg-blue-400">
              {" "}
              {loading ? <Loader className="animate-spin" /> : "Sign up"}
            </button>
            <NavLink to={"/"}>
              {" "}
              <p className="text-[12px] text-gray-600 hover:text-black hover:underline mt-1">
                Already existing user ?{" "}
                <span className="text-blue-600">LogIn Now</span>
              </p>
            </NavLink>
          </form>
        </div>
        <div className="w-1/2 hidden md:block">
          <img
            src="https://img.freepik.com/free-vector/telecommuting-concept_23-2148488790.jpg?t=st=1740739710~exp=1740743310~hmac=0ad92648ad4c4b3228f16b2d36998ab65efe497050d96b3e54d2f17032ecf4b0&w=1060"
            alt="image"
            className=" w-[80%]"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
