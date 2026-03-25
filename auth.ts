import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          // If password is correct, retun user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // if doesn't match or user doesn't exist, return null
        return null;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger , token }: any) {
        // Set the user ID from the token
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.name = token.name;
        
        // console.log(token)

        // if there is an update, set the new name and email in the session
        if (trigger === "update") {
            session.user.name = user.name;
        }
        
        return session
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      // Assign user field to the token
      if (user) {
        token.role = user.role;

        // if the user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]

          // Update the database to reflect the token name
          await prisma.user.update({
            where: {id: user.id},
            data: {name: token.name}
          });
        }  
      }
      return token;
    },
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // Check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Clone request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create the new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders
          }
        });

        // Set newly generated sessionCartId in the  response cookies
        response.cookies.set('sessionCartId', sessionCartId);

        return response;

      } else {
        return true;
      }
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
