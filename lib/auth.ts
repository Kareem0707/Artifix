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
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      if (!user) return session;

      const { data, error } = await supabaseAdmin
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single();
      
      session.user.credits = data?.credits ?? 50;
      session.user.id = user.id;
      
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
