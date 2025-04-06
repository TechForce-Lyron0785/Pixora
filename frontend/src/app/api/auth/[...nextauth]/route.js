import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          // Send user details to backend for saving in MongoDB
          const username = user.email.split('@')[0];
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/google-login`, {
            email: user.email,
            fullName: user.name,
            profilePicture: user.image,
            username,
          }, { 
            withCredentials: true 
          });

          user.backendData = response.data.data;
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.backendToken = user.backendData?.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.backendToken = token.backendToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
