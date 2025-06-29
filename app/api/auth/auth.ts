import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createUser, getUserByEmail } from '@/lib/db/queries';
import GoogleProvider from 'next-auth/providers/google';

import { authConfig } from './auth.config';


interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUserByEmail(email);
        if (users === null) return null;
        const passwordsMatch = await compare(password, users.password!);
        if (!passwordsMatch) return null;
        return users as any;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await getUserByEmail(user.email!);
        if (!existingUser) {
          await createUser(user.email!, null, 'google', user.name!);
        }
      }
      return true;
    },
    
    async jwt({ token, user,account }) {
      if (user) {
       if (account?.provider === 'google') {
          const users = await getUserByEmail(user.email!);
          if (users !== null) {
            token.id = users.id;
            token.provider = users.provider;
          }
        } else {
        token.id = user.id;
      }
    }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).provider = token.provider; 
      }

      return session;
    },
  },
});
