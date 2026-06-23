import { SupabaseAdapter } from "@auth/supabase-adapter";

const adapter = SupabaseAdapter({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

async function run() {
  try {
    const user = await adapter.createUser({
      name: "Test User",
      email: "test@example.com",
      emailVerified: new Date(),
      image: "test.png"
    });
    console.log("Success:", user);
  } catch (e) {
    console.error("Error creating user:", e);
  }
}

run();
