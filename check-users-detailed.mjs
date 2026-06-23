import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dioykablihhntshghvos.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3lrYWJsaWhobnRzaGdodm9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI3MTcwMiwiZXhwIjoyMDg4ODQ3NzAyfQ.NCtTc-EXW3cwg2pDhYkvxjRWDunz5HMSjjTCE8MWK0Y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('id, name, email, credits');
  if (error) {
    console.error("Error fetching users:", error);
  } else {
    console.log("Users in DB:", data);
  }

  const { data: accounts, error: accountsError } = await supabase.from('accounts').select('id, userId, providerAccountId');
  console.log("Accounts in DB:", accounts);
}

checkUsers();
