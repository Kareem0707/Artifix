import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { supabaseAdmin } from "./supabase"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: 'https://dioykablihhntshghvos.supabase.co',
    secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3lrYWJsaWhobnRzaGdodm9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI3MTcwMiwiZXhwIjoyMDg4ODQ3NzAyfQ.NCtTc-EXW3cwg2pDhYkvxjRWDunz5HMSjjTCE8MWK0Y',
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
