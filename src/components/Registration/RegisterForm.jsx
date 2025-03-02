import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { div } from "framer-motion/client";

const travelStyles = [
  { value: "luxury", label: "Luxury" },
  { value: "budget", label: "Budget" },
  { value: "adventure", label: "Adventure" },
];

const travelInterests = [
  { value: "history", label: "History" },
  { value: "nature", label: "Nature" },
  { value: "food", label: "Food" },
  { value: "art", label: "Art" },
];

const destinations = [
  { value: "paris", label: "Paris" },
  { value: "tokyo", label: "Tokyo" },
  { value: "new_york", label: "New York" },
  { value: "sydney", label: "Sydney" },
];

const mbtiTypes = [
  { value: "ISTJ", label: "ISTJ - The Inspector" },
  { value: "ISFJ", label: "ISFJ - The Protector" },
  { value: "INFJ", label: "INFJ - The Counselor" },
  { value: "INTJ", label: "INTJ - The Mastermind" },
  { value: "ISTP", label: "ISTP - The Craftsman" },
  { value: "ISFP", label: "ISFP - The Composer" },
  { value: "INFP", label: "INFP - The Healer" },
  { value: "INTP", label: "INTP - The Architect" },
  { value: "ESTP", label: "ESTP - The Dynamo" },
  { value: "ESFP", label: "ESFP - The Performer" },
  { value: "ENFP", label: "ENFP - The Champion" },
  { value: "ENTP", label: "ENTP - The Visionary" },
  { value: "ESTJ", label: "ESTJ - The Supervisor" },
  { value: "ESFJ", label: "ESFJ - The Provider" },
  { value: "ENFJ", label: "ENFJ - The Teacher" },
  { value: "ENTJ", label: "ENTJ - The Commander" }
];

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onSubmit = async (data) => {
    if (!email) {
      console.error('Email not found in state');
      return;
    }

    console.log("Email arrived : ", email);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('profilePicture', data.profilePicture[0]);
    formData.append('mbti', data.mbti.value);
    formData.append('mailingAddress', data.mailingAddress);
    formData.append('destinations', JSON.stringify(data.destinations));
    formData.append('travelStyles', JSON.stringify(data.travelStyles));
    formData.append('travelInterests', JSON.stringify(data.travelInterests));

    try {
      const response = await fetch('http://localhost:8080/api/users/complete-registration', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (response.ok) {
        const responseData = await response.json(); // Assuming API returns JSON
        navigate("/dashboard", { state: { user: responseData.user } });
      } else {
        const errorText = await response.text();
        console.error('Registration failed:', errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="w-full font-poppins h-screen py-10 bg-gray-100 flex justify-center items-center">
      <div className="w-[1000px] max-w-2xl mx-auto bg-white p-9 py-12 shadow-lg rounded-[15px]">
        <h2 className="text-3xl font-semibold mb-8 font-poppins">Complete Your Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-poppins">

          {/* Profile Picture */}
          <div>
            <label className="block text-sm mb-2 font-medium">Profile Picture</label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">
                    {preview ? (
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="h-12 w-12 object-cover rounded-full"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                      {selectedFile 
                        ? selectedFile.name 
                        : "Upload a picture to illustrate your profile"
                      }
                    </label>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (rec. 700×430px)</p>
                  </div>
                </div>
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Browse
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  {...register("profilePicture", { 
                    required: "Profile picture is required",
                    onChange: handleFileChange
                  })}
                  className="hidden"
                />
              </div>
              {errors.profilePicture && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profilePicture.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User Experience Container 1 */}
            <div className="space-y-4">
              {/* MBTI */}
              <div>
                <label className="block text-sm mb-2 font-medium">
                  MBTI
                  <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2 text-sm underline">
                    Don't know your MBTI?
                  </a>
                </label>
                <Controller
                  name="mbti"
                  control={control}
                  rules={{ required: "MBTI is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={mbtiTypes}
                      placeholder="Select your MBTI type"
                      className="basic-select"
                      isClearable
                      styles={{
                        placeholder: (baseStyles) => ({
                          ...baseStyles,
                          fontSize: '0.875rem',
                        }),
                      }}
                      filterOption={(option, input) => {
                        if (!input) return true;
                        const searchInput = input.toUpperCase();
                        const mbtiValue = option.value.toUpperCase();
                        return mbtiValue.startsWith(searchInput);
                      }}
                    />
                  )}
                />
                {errors.mbti && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mbti.message}
                  </p>
                )}
              </div>

              {/* Travel Interests - Moved from Container 2 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Travel Interests
                </label>
                <Controller
                  name="travelInterests"
                  control={control}
                  rules={{ required: "Please select at least one interest" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={travelInterests}
                      placeholder="Choose travel interests"
                      className="basic-multi-select"
                      styles={{
                        placeholder: (baseStyles) => ({
                          ...baseStyles,
                          fontSize: '0.875rem',
                        }),
                      }}
                    />
                  )}
                />
                {errors.travelInterests && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.travelInterests.message}
                  </p>
                )}
              </div>
            </div>

            {/* User Experience Container 2 */}
            <div className="space-y-4">
              {/* Travel Preferences */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Destinations
                </label>
                <Controller
                  name="destinations"
                  control={control}
                  rules={{ required: "Please select at least one destination" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={destinations}
                      placeholder="Choose destinations"
                      className="basic-multi-select"
                      styles={{
                        placeholder: (baseStyles) => ({
                          ...baseStyles,
                          fontSize: '0.875rem',
                        }),
                      }}
                    />
                  )}
                />
                {errors.destinations && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.destinations.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Travel Styles
                </label>
                <Controller
                  name="travelStyles"
                  control={control}
                  rules={{ required: "Please select at least one style" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={travelStyles}
                      placeholder="Choose travel styles"
                      className="basic-multi-select"
                      styles={{
                        placeholder: (baseStyles) => ({
                          ...baseStyles,
                          fontSize: '0.875rem',
                        }),
                      }}
                    />
                  )}
                />
                {errors.travelStyles && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.travelStyles.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Move Mailing Address outside the grid to take full width */}
          <div className="mt-8">
            <label htmlFor="mailingAddress" className="block text-sm mb-2 font-medium">
              Mailing Address
            </label>
            <input
              type="text"
              id="mailingAddress"
              {...register("mailingAddress", { required: "Address is required" })}
              placeholder="123 Main Street, Apt 4B"
              className={`w-full p-2 border rounded-md text-sm placeholder:text-sm ${
                errors.mailingAddress ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.mailingAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mailingAddress.message}
              </p>
            )}
          </div>

          {/* Terms of Service */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              {...register("terms", {
                required: "You must agree to the terms and conditions",
              })}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="terms" className="ml-2 text-sm">
              I agree to the{" "}
              <a href="#" className="text-blue-600 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;