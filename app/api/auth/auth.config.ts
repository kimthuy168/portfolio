import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;;
      const isOnRegister = nextUrl.pathname.startsWith('/admin/register');
      const isOnLogin = nextUrl.pathname.startsWith('/admin/login');
      const isOnHome = nextUrl.pathname.startsWith('/');

      if (isOnRegister || isOnLogin || isOnHome) {
        return true; // Always allow access to register and login pages
      }

      if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
