import { motion } from "framer-motion";
const SinglePageLoader = ({ text }: { text?: string }) => {
  return (
    <div className="fixed  inset-0 z-[9999]  flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex flex-col items-center z-[999] relative"
        >
          {/* Spinning Loader */}
          <motion.div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />

          {/* Animated Changing Text */}
          <motion.p
            className="mt-4 text-sm font-semibold text-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            Loading {text}...
          </motion.p>
        </motion.div>
      </div>

      <div className="fixed inset-0 z-40 bg-gray-200 duration-500 ease-in-out backdrop-blur-md opacity-50" />
    </div>
  );
};

export default SinglePageLoader;
