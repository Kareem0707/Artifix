import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dioykablihhntshghvos.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3lrYWJsaWhobnRzaGdodm9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI3MTcwMiwiZXhwIjoyMDg4ODQ3NzAyfQ.NCtTc-EXW3cwg2pDhYkvxjRWDunz5HMSjjTCE8MWK0Y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log(`Checking database at: ${supabaseUrl}`);
  const { data, error } = await supabase.from('users').select('*');
  
  if (error) {
    console.error("Error fetching users:", error);
  } else {
    console.log(`Found ${data.length} users in the database.`);
    console.log("Users:", data);
  }
}

checkUsers();
