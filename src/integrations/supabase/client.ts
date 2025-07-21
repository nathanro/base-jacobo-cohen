import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evewecojyocoizujgfow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZXdlY29qeW9jb2l6dWpnZm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTM0NzIsImV4cCI6MjA2ODY2OTQ3Mn0.jbNVdhYU4Yl-JlPioUlTtGov5W8UyNCqKz2Niyk5Ct8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);