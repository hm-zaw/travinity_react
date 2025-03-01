import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

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

  const onSubmit = async (data) => {
    if (!email) {
      console.error('Email not found in state');
      return;
    }

    console.log("Email arrived : ", email);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('profilePicture', data.profilePicture[0]);
    formData.append('mbti', data.mbti);
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

  return (
    <div className="w-[1000px] max-w-2xl mx-auto bg-white p-9 shadow-md mt-[100px] rounded-[25px]">
      <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Profile Picture */}
        <div className="space-y-4">
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              {...register("profilePicture", { required: "Profile picture is required" })}
              className={`w-full p-2 border rounded-md ${
                errors.profilePicture ? "border-red-500" : "border-gray-300"
              }`}
            />
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
              <label htmlFor="mbti" className="block text-sm font-medium">
                MBTI
                <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2 text-sm underline">
                  Don't know your MBTI?
                </a>
              </label>
              <input
                type="text"
                id="mbti"
                {...register("mbti", { required: "MBTI is required" })}
                placeholder="E.g., INTP, ENFJ"
                className={`w-full p-2 border rounded-md ${
                  errors.mbti ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.mbti && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mbti.message}
                </p>
              )}
            </div>

            {/* Mailing Address */}
            <div>
              <label htmlFor="mailingAddress" className="block text-sm font-medium">
                Mailing Address
              </label>
              <input
                type="text"
                id="mailingAddress"
                {...register("mailingAddress", { required: "Address is required" })}
                placeholder="123 Main Street, Apt 4B"
                className={`w-full p-2 border rounded-md ${
                  errors.mailingAddress ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.mailingAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mailingAddress.message}
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
                  />
                )}
              />
              {errors.travelStyles && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.travelStyles.message}
                </p>
              )}
            </div>

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
  );
};

export default RegisterForm;