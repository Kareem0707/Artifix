import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dioykablihhntshghvos.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3lrYWJsaWhobnRzaGdodm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzE3MDIsImV4cCI6MjA4ODg0NzcwMn0.EqO6K6obfaB7f6kWOsFlaBGRmD_tT3XPbcQiHj8tqD0';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpb3lrYWJsaWhobnRzaGdodm9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI3MTcwMiwiZXhwIjoyMDg4ODQ3NzAyfQ.NCtTc-EXW3cwg2pDhYkvxjRWDunz5HMSjjTCE8MWK0Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Specifically for administrative actions like updating credits
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
