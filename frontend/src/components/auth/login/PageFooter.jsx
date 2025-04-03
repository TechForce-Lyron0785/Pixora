import { motion } from "framer-motion";
import Link from "next/link";

export default function PageFooter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="absolute bottom-4 left-0 right-0 text-center"
    >
      <div className="text-xs text-gray-500 flex items-center justify-center space-x-4">
        <span>&copy; {new Date().getFullYear()} Pixora AI Studio</span>
        <span className="h-3 w-px bg-gray-700"></span>
        <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
        <span className="h-3 w-px bg-gray-700"></span>
        <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
        <span className="h-3 w-px bg-gray-700"></span>
        <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
      </div>
    </motion.div>
  );
} 