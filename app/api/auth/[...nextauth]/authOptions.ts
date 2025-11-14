import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;
        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
    newUser: "/signup",
    signOut: "/signout",
    error: "/error",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider && profile?.email) {
        const prismaUser = await prisma.user.upsert({
          where: { email: profile.email },
          create: {
            email: profile.email,
            name: profile.name,
            emailVerified: new Date(),
          },
          update: {
            name: profile.name,
            emailVerified: new Date(),
          },
        });

        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId!,
            },
          },
          create: {
            userId: prismaUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId!,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          },
          update: {},
        });
      }
      return true;
    },

    async redirect() {
      return process.env.NEXTAUTH_URL || "/";
    },

    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
