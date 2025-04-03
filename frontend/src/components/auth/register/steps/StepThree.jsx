import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StepThree({ formData, errors, availableInterests, handleChange, handleInterestToggle }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white">Personalize your experience</h2>
        <p className="text-gray-400">Select your interests to personalize your feed</p>
      </div>

      {/* Interests Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          What are you interested in?
        </label>
        <div className="flex flex-wrap gap-2 mt-3">
          {availableInterests.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => handleInterestToggle(interest)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${formData.interests.includes(interest)
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Selected: {formData.interests.length > 0 ? formData.interests.join(", ") : "None"}
        </p>
      </div>

      {/* Newsletter Subscription */}
      <div className="flex items-center">
        <input
          id="subscribeNewsletter"
          name="subscribeNewsletter"
          type="checkbox"
          checked={formData.subscribeNewsletter}
          onChange={handleChange}
          className="h-4 w-4 rounded focus:ring-purple-500 bg-gray-800 border-gray-700 text-purple-600"
        />
        <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-gray-300">
          Subscribe to our newsletter for updates and tips
        </label>
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="h-4 w-4 rounded focus:ring-purple-500 bg-gray-800 border-gray-700 text-purple-600"
          />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="agreeToTerms" className="text-gray-300">
            I agree to the <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link> and <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
          </label>
          <AnimatePresence>
            {errors.agreeToTerms && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-400 mt-1"
              >
                {errors.agreeToTerms}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 