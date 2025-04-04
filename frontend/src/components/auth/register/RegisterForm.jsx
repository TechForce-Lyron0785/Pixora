import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { CheckCircle, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import Image from "next/image";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";

export default function RegisterForm() {
  const router = useRouter();
  const { register, checkUserExists, googleLogin, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: "",
    email: "",
    username: "",

    // Step 2: Security
    password: "",
    confirmPassword: "",

    // Step 3: Preferences
    interests: [],
    subscribeNewsletter: false,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationPassed, setValidationPassed] = useState({
    username: false,
    email: false,
  });

  // Available interests for selection
  const availableInterests = [
    "Photography",
    "Digital Art",
    "AI Generation",
    "Landscapes",
    "Portraits",
    "Abstract",
    "Fantasy",
    "Sci-Fi",
    "Nature",
  ];

  const validateStep = (step) => {
    let tempErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        tempErrors.fullName = "Full name is required";
      }

      if (!formData.email) {
        tempErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = "Email address is invalid";
      }

      if (!formData.username.trim()) {
        tempErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        tempErrors.username = "Username must be at least 3 characters";
      }
    }

    if (step === 2) {
      if (!formData.password) {
        tempErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        tempErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword) {
        tempErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) {
        tempErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Reset validation status when field changes
    if (name === "username" || name === "email") {
      setValidationPassed((prev) => ({ ...prev, [name]: false }));
    }

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleInterestToggle = (interest) => {
    const updatedInterests = [...formData.interests];
    if (updatedInterests.includes(interest)) {
      const index = updatedInterests.indexOf(interest);
      updatedInterests.splice(index, 1);
    } else {
      updatedInterests.push(interest);
    }
    setFormData({ ...formData, interests: updatedInterests });
  };

  const nextStep = async () => {
    if (!validateStep(currentStep)) return;

    // For step 1, check if username or email is already taken
    if (currentStep === 1) {
      try {
        setIsSubmitting(true);
        // Check if username or email exists
        const { exists: usernameExists, message: usernameMessage } =
          await checkUserExists({
            username: formData.username,
          });

        if (usernameExists) {
          setErrors((prev) => ({ ...prev, username: usernameMessage }));
          setValidationPassed((prev) => ({ ...prev, username: false }));
          setIsSubmitting(false);
          return;
        } else {
          setValidationPassed((prev) => ({ ...prev, username: true }));
        }

        const { exists: emailExists, message: emailMessage } =
          await checkUserExists({
            email: formData.email,
          });

        if (emailExists) {
          setErrors((prev) => ({ ...prev, email: emailMessage }));
          setValidationPassed((prev) => ({ ...prev, email: false }));
          setIsSubmitting(false);
          return;
        } else {
          setValidationPassed((prev) => ({ ...prev, email: true }));
        }

        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error("An error occurred. Please try again.");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Submit registration data
      const userData = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const { success, error, data } = await register(userData);

      if (success) {
        toast.success("Registration successful!");
        router.push("/"); // Redirect to home page
      } else {
        toast.error(error || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step indicators
  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-8">
      {[...Array(totalSteps)].map((_, idx) => (
        <div key={idx} className="flex items-center">
          <div
            className={`rounded-full transition-all flex items-center justify-center ${
              idx + 1 === currentStep
                ? "bg-purple-500 text-white"
                : idx + 1 < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-400"
            } h-8 w-8 text-sm font-medium`}
          >
            {idx + 1 < currentStep ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              idx + 1
            )}
          </div>
          {idx < totalSteps - 1 && (
            <div
              className={`h-1 w-12 mx-1 ${
                idx + 1 < currentStep ? "bg-green-500" : "bg-gray-700"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            formData={formData}
            errors={errors}
            validationPassed={validationPassed}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <StepTwo
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative z-10">
      {/* Logo and Brand */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 flex items-center"
      >
        <div className="p-1 rounded-md shadow-lg shadow-gray-500/20 bg-white/10 backdrop-blur-sm">
          <Image
            src="/images/logo.png"
            className="w-8 h-8"
            alt="Pixora logo"
            height={20}
            width={20}
          />
        </div>
        <span className="text-white font-bold text-2xl ml-3">Pixora</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-white tracking-tight">
          Create your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            account
          </span>
        </h1>
        <p className="mb-6 text-gray-300">
          Join Pixora to create and share AI-generated imagery
        </p>
      </motion.div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Multi-step Form Container */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <form
          onSubmit={
            currentStep === totalSteps
              ? handleSubmit
              : (e) => e.preventDefault()
          }
        >
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            {currentStep > 1 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back
              </motion.button>
            ) : (
              <div></div> // Empty div for flex spacing
            )}

            {currentStep < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg shadow-purple-500/20"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Checking...
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg shadow-purple-500/20"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <UserPlus className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Social Registration */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8"
      >
        <button
          type="button"
          onClick={googleLogin}
          className="w-full py-3 px-4 rounded-xl font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 flex justify-center items-center text-sm transition-all gap-2 cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-base">Continue with Google</span>
        </button>
      </motion.div>

      {/* Login Link */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
