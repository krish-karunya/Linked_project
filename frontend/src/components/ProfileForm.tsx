import { X } from "lucide-react";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import EducationForm from "./EducationForm";
import { useForm } from "react-hook-form";

const ProfileForm: React.FC<{
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [educationMenu, setEducationMenu] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      userName: "",
      about: "",
      headline: "",
      location: "",
      education: [],
      experience: [],
      skill: [],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="w-7/12 bg-white mx-auto rounded-lg absolute top-1 right-66 z-50 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold p-4 rounded-lg text-sky-500">
          Edit Profile
        </h1>
        <div className="mr-4" onClick={() => setEdit(false)}>
          <X />
        </div>
      </div>
      <form
        action=""
        className="p-8 flex flex-col gap-2 text-gray-500"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <label htmlFor="userName" className="font-semibold">
            Username*
          </label>
          <input
            type="text"
            className="outline-none border border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
            {...register("userName")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="about" className="font-semibold">
            About
          </label>
          <input
            type="text"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("about")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="headline" className="font-semibold">
            Headline
          </label>
          <input
            type="text"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("headline")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="font-semibold">
            Location
          </label>
          <input
            type="text"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("location")}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="education"
            className="font-semibold flex items-center justify-between"
          >
            Education
          </label>
          {isMenuOpen && (
            <div className="w-full h-screen">
              <EducationForm setIsMenuOpen={setIsMenuOpen} />
            </div>
          )}
          <span
            className="text-sky-600 mt-4 flex items-center gap-2"
            onClick={() => setIsMenuOpen(true)}
          >
            <Plus /> <span className="font-semibold">Add Education</span>
          </span>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="experience"
            className="font-semibold flex items-center justify-between"
          >
            Experience
          </label>
          <span className="text-sky-600 mt-4 flex items-center gap-2">
            <Plus /> <span className="font-semibold">Add Education</span>
          </span>
        </div>
        <div className="flex flex-col">
          <label htmlFor="skill" className="font-semibold">
            Skill
          </label>
          <input
            type="text"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("skill")}
          />
        </div>
        <button className="mt-6 w-full bg-sky-600 py-2 rounded text-white text-xl font-semibold">
          save
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
