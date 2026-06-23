import { SupabaseAdapter } from "@auth/supabase-adapter";

const adapter = SupabaseAdapter({
  url: 'https://dioykablihhntshghvos.supabase.co',
  secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3lrYWJsaWhobnRzaGdodm9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI3MTcwMiwiZXhwIjoyMDg4ODQ3NzAyfQ.NCtTc-EXW3cwg2pDhYkvxjRWDunz5HMSjjTCE8MWK0Y',
});

async function testInsert() {
  try {
    console.log("Attempting to create user via adapter...");
    const user = await adapter.createUser({
      name: "Test User",
      email: "test@example.com",
      emailVerified: new Date(),
      image: "https://example.com/image.png",
    });
    console.log("Success! Created user:", user);
  } catch (error) {
    console.error("Adapter error:", error);
  }
}

testInsert();
