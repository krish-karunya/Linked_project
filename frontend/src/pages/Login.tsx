import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logInpSchema } from "../utils/schemaValidation";
import { useAuthContext } from "../context/AuthUser";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader } from "lucide-react";
import { useState } from "react";

type FormDataShape = { email: string; password: string };

const Login = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormDataShape>({
    resolver: zodResolver(logInpSchema),
  });

  const { authUser, setAuthUser } = useAuthContext();

  const HandleSubmit = async (data: FormDataShape) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", data);
      // console.log(data);
      localStorage.setItem("user", JSON.stringify(response.data));

      setAuthUser(response.data);
      toast.success(`${response.data.data.userName} ` + response.data.message);
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
  console.log(errors);
  return (
    <div className="py-20">
      {" "}
      <div>
        <form
          className="flex justify-center items-center p-4 gap-12"
          onSubmit={handleSubmit(HandleSubmit)}
        >
          <div className="w-1/2">
            <img
              src="https://img.freepik.com/free-vector/telecommuting-concept_23-2148488790.jpg?t=st=1740739710~exp=1740743310~hmac=0ad92648ad4c4b3228f16b2d36998ab65efe497050d96b3e54d2f17032ecf4b0&w=1060"
              alt="image"
              className=" w-[80%] ml-20"
            />
          </div>
          <div className="w-1/2  rounded-lg ml-16 ">
            <h1 className="text-center text-3xl mr-20 mb-2 text-blue-700 font-semibold">
              Log In
            </h1>
            <div className=" w-[80%] p-4 rounded-lg flex flex-col justify-center shadow-xl bg-gray-100">
              <h1 className="text-3xl text-red-900 mb-4">
                Welcome to our professional Community
              </h1>

              <div>
                <label htmlFor="userName" className="text-sm text-gray-500">
                  Email
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-500 py-1 px-2 "
                  id="email"
                  {...register("email")}
                />
              </div>
              <p className="text-[12px] text-red-400">
                {errors.email?.message}
              </p>

              <div>
                <label htmlFor="userName" className="text-sm text-gray-500">
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

              <button
                className="w-full py-2 mt-8 bg-blue-600 rounded font-semibold text-white hover:bg-blue-400 flex justify-center items-center"
                type="submit"
              >
                {" "}
                {loading ? <Loader className="animate-spin" /> : "Log In"}
              </button>
              <NavLink to={"/signup"}>
                {" "}
                <p className="text-[12px] text-gray-600 hover:text-black hover:underline mt-1">
                  New user ? <span className="text-blue-600">Signup Now</span>
                </p>
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
