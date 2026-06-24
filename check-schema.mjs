import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dioykablihhntshghvos.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3lrYWJsaWhobnRzaGdodm9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI3MTcwMiwiZXhwIjoyMDg4ODQ3NzAyfQ.NCtTc-EXW3cwg2pDhYkvxjRWDunz5HMSjjTCE8MWK0Y';

const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'next_auth' } });

async function check() {
  const { data, error } = await supabase.from('users').select('*');
  console.log("next_auth.users:", data);
  if (error) console.error(error);
}

check();
