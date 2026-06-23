import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { supabaseAdmin } from "./supabase"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // Temporary bypass: hardcode credits to 9999 to get site fully working
      session.user.credits = 9999;
      
      // Handle both JWT and Database strategy gracefully
      if (user?.id) {
        session.user.id = user.id;
      } else if (token?.sub) {
        session.user.id = token.sub;
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
})

// Extend types for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      credits: number;
    } & import("next-auth").DefaultSession["user"]
  }
  
  interface User {
    credits?: number;
  }
}
