import { SupabaseAdapter } from "@auth/supabase-adapter";

const adapter = SupabaseAdapter({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

async function run() {
  try {
    const user = await adapter.createUser({
      name: "Test User 2",
      email: "test2@example.com",
      emailVerified: new Date(),
      image: "test2.png"
    });
    console.log("CreateUser:", user);
    
    const account = await adapter.linkAccount({
      userId: user.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "123456789",
      access_token: "test_token"
    });
    console.log("LinkAccount:", account);

    const session = await adapter.createSession({
      sessionToken: "test_session_token",
      userId: user.id,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    });
    console.log("CreateSession:", session);

  } catch (e) {
    console.error("Adapter error:", e);
  }
}

run();
