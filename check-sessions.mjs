import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dioykablihhntshghvos.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3lrYWJsaWhobnRzaGdodm9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI3MTcwMiwiZXhwIjoyMDg4ODQ3NzAyfQ.NCtTc-EXW3cwg2pDhYkvxjRWDunz5HMSjjTCE8MWK0Y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSessions() {
  const { data, error } = await supabase.from('sessions').select('*').limit(1);
  if (error) {
    console.error("Error fetching sessions:", error.message);
  } else {
    console.log("Sessions table exists! Data:", data);
  }
}

checkSessions();
