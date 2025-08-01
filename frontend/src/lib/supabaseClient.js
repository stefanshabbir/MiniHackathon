import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hhknueuzvllmstjmzsja.supabase.co'; // replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoa251ZXV6dmxsbXN0am16c2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTk3NzMsImV4cCI6MjA2OTU5NTc3M30.bZ2d2iLSS_E-N-iraK30Ms08oJ_txp9GCHShD4wWt98'; // replace with your anon/public key

export const supabase = createClient(supabaseUrl, supabaseKey);