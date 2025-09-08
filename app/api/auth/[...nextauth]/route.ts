import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Lookup the user from the database.
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials?.email },
        // });
        
        // if (user && user.password === credentials?.password) {
        //   return user;
        // }

        return Promise.reject(new Error("Not implemented yet"));
        // If you return null then an error will be displayed advising the user to check their details.
        // If you throw an error then it will be passed to the error page for your app to handle.
        // If you return a user object, then that user will be logged in.
        // If you return a string, then it will be treated as an error message.
        return "not-implemented-yet" as any;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }), 
  ],
   pages: {
    signIn: "/signin", // Move to /auth/signin
    signOut: "/signout",
    error: "/error", // Error code passed in query string as ?error=
    verifyRequest: "/verify-request", // (used for check email message)
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});


export { handler as GET, handler as POST };