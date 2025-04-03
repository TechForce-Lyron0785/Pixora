import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Pixora — Upload, share, and shine—your images, your way.",
  description: "Share your world in pixels! Upload, organize, and showcase your favorite images with ease on Pixora—the simplest way to share memories, art, and moments with friends or the world. Fast, free, and fun!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
