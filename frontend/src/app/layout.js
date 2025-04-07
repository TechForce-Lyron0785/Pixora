import { SessionWrapper } from "@/components/hoc";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { FollowProvider } from "@/context/FollowContext";
import { UsersProvider } from '@/context/UsersContext';
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Pixora — Upload, share, and shine—your images, your way.",
  description: "Share your world in pixels! Upload, organize, and showcase your favorite images with ease on Pixora—the simplest way to share memories, art, and moments with friends or the world. Fast, free, and fun!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <AuthProvider>
            <FollowProvider>
              <UsersProvider>
                <Toaster position="top-center" />
                {children}
              </UsersProvider>
            </FollowProvider>
          </AuthProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
